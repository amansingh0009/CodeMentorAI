package com.codementorai.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AiReviewResponse {
    private final String review;
    private final String complexity;
    private final String recommendations;
    private final String interviewFeedback;
}
