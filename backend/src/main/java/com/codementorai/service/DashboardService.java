package com.codementorai.service;

import com.codementorai.dto.DashboardAnalyticsDto;
import com.codementorai.dto.LeaderboardDto;
import com.codementorai.exception.ResourceNotFoundException;
import com.codementorai.model.LeaderboardEntry;
import com.codementorai.model.Submission;
import com.codementorai.model.User;
import com.codementorai.repository.LeaderboardRepository;
import com.codementorai.repository.SubmissionRepository;
import com.codementorai.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final LeaderboardRepository leaderboardRepository;

    public DashboardService(UserRepository userRepository, SubmissionRepository submissionRepository, LeaderboardRepository leaderboardRepository) {
        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
        this.leaderboardRepository = leaderboardRepository;
    }

    public DashboardAnalyticsDto getAnalytics() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Submission> submissions = submissionRepository.findByUser(user);
        DashboardAnalyticsDto analytics = new DashboardAnalyticsDto();
        analytics.setTotalSubmissions(submissions.size());
        analytics.setTotalSolved((int) submissions.stream().filter(s -> "REVIEWED".equals(s.getStatus())).count());
        analytics.setAverageScore((int) submissions.stream().map(Submission::getScore).filter(s -> s != null).mapToInt(Integer::intValue).average().orElse(0.0));
        analytics.setActiveQuestions((int) submissionRepository.count());
        return analytics;
    }

    public List<LeaderboardDto> getLeaderboard() {
        return leaderboardRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private LeaderboardDto mapToDto(LeaderboardEntry entry) {
        LeaderboardDto dto = new LeaderboardDto();
        dto.setUsername(entry.getUser().getUsername());
        dto.setTotalScore(entry.getTotalScore());
        dto.setSolvedQuestions(entry.getSolvedQuestions());
        return dto;
    }
}
