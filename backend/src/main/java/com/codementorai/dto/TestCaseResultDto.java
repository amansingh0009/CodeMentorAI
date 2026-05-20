package com.codementorai.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TestCaseResultDto {
    private Integer caseNumber;
    private String input;
    private String expectedOutput;
    private String actualOutput;
    private Boolean passed;
    private String error;
}
