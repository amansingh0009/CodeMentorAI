package com.codementorai.service;

import com.codementorai.dto.AiReviewRequest;
import com.codementorai.dto.AiReviewResponse;
import com.codementorai.model.Submission;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AiReviewService {
    @Value("${ai.provider}")
    private String provider;

    @Value("${openai.api.key:}")
    private String openAiApiKey;

    @Value("${groq.api.key:}")
    private String groqApiKey;

    public AiReviewResponse reviewSubmission(Submission submission) {
        String prompt = buildPrompt(submission);
        String rawResponse = callAiApi(prompt);
        return parseAiResponse(rawResponse);
    }

    public AiReviewResponse reviewCode(AiReviewRequest request) {
        String prompt = "Review the following code for quality, bugs, time complexity, and interview feedback:\n\n" + request.getCode();
        String rawResponse = callAiApi(prompt);
        return parseAiResponse(rawResponse);
    }

    private AiReviewResponse parseAiResponse(String rawResponse) {
        return new AiReviewResponse(
                "AI review generated.",
                "O(n) estimated based on current implementation.",
                "Refactor duplicated logic and handle edge cases.",
                "Great structure: add comments and defensive input validation."
        );
    }

    private String buildPrompt(Submission submission) {
        return "Review the following code for quality, bugs, time complexity, and interview feedback:\n\n" + submission.getCode();
    }

    private String callAiApi(String prompt) {
        if ("groq" .equalsIgnoreCase(provider)) {
            return callGroq(prompt);
        }
        return callOpenAi(prompt);
    }

    private String callOpenAi(String prompt) {
        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            return "OpenAI API not configured. Provide OPENAI_API_KEY in environment.";
        }
        // Placeholder for actual OpenAI integration
        return "AI code review placeholder response.";
    }

    private String callGroq(String prompt) {
        if (groqApiKey == null || groqApiKey.isBlank()) {
            return "Groq API not configured. Provide GROQ_API_KEY in environment.";
        }
        // Placeholder for actual Groq integration
        return "AI code review placeholder response.";
    }
}
