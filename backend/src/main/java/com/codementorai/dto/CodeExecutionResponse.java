package com.codementorai.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CodeExecutionResponse {
    private String status;
    private String message;
    private Integer passedCount;
    private Integer totalCount;
    private List<TestCaseResultDto> results;
}
