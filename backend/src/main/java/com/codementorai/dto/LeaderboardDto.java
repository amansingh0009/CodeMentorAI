package com.codementorai.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaderboardDto {
    private String username;
    private Integer totalScore;
    private Integer solvedQuestions;
}
