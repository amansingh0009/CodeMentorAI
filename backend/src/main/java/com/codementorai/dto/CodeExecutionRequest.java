package com.codementorai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodeExecutionRequest {
    @NotNull
    private Long questionId;

    @NotBlank
    private String code;

    @NotBlank
    private String language;
}
