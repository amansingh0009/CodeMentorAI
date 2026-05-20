package com.codementorai.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardAnalyticsDto {
    private Integer totalSubmissions;
    private Integer totalSolved;
    private Integer averageScore;
    private Integer activeQuestions;
}
