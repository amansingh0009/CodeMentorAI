package com.codementorai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiReviewRequest {
    @NotBlank
    private String code;

    @NotBlank
    private String language;

    @NotBlank
    private String promptContext;
}
