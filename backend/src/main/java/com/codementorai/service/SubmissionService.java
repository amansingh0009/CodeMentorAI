package com.codementorai.service;

import com.codementorai.dto.SubmissionRequest;
import com.codementorai.exception.ResourceNotFoundException;
import com.codementorai.model.AiFeedback;
import com.codementorai.model.Question;
import com.codementorai.model.Submission;
import com.codementorai.model.User;
import com.codementorai.repository.AiFeedbackRepository;
import com.codementorai.repository.QuestionRepository;
import com.codementorai.repository.SubmissionRepository;
import com.codementorai.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final AiReviewService aiReviewService;
    private final AiFeedbackRepository aiFeedbackRepository;
    private final LeaderboardService leaderboardService;

    public SubmissionService(SubmissionRepository submissionRepository, QuestionRepository questionRepository, UserRepository userRepository, AiReviewService aiReviewService, AiFeedbackRepository aiFeedbackRepository, LeaderboardService leaderboardService) {
        this.submissionRepository = submissionRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.aiReviewService = aiReviewService;
        this.aiFeedbackRepository = aiFeedbackRepository;
        this.leaderboardService = leaderboardService;
    }

    public Submission submit(SubmissionRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Question question = questionRepository.findById(request.getQuestionId()).orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        Submission submission = Submission.builder()
                .user(user)
                .question(question)
                .code(request.getCode())
                .language(request.getLanguage())
                .status("PENDING")
                .submittedAt(LocalDateTime.now())
                .build();
        submission = submissionRepository.save(submission);

        var feedback = aiReviewService.reviewSubmission(submission);
        submission.setStatus("REVIEWED");
        submission.setFeedbackSummary(feedback.getReview());
        submission.setScore(Math.max(60, Math.min(100, feedback.getReview().length() % 101)));
        submissionRepository.save(submission);

        AiFeedback aiFeedback = AiFeedback.builder()
                .submission(submission)
                .review(feedback.getReview())
                .complexity(feedback.getComplexity())
                .recommendations(feedback.getRecommendations())
                .generatedAt(LocalDateTime.now())
                .build();
        aiFeedbackRepository.save(aiFeedback);
        leaderboardService.updateLeaderboard(user, submission.getScore());

        return submission;
    }

    public List<Submission> getUserSubmissions() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return submissionRepository.findByUser(user);
    }

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    public Submission getSubmission(Long id) {
        return submissionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
    }
}
