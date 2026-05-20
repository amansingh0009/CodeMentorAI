package com.codementorai.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class QuestionDto {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private String category;
    private String inputFormat;
    private String outputFormat;
    private List<String> constraints;
    private String sampleInput;
    private String sampleOutput;
    private List<QuestionExampleDto> examples;
    private List<String> tags;
    private Map<String, String> starterCode; // language -> starter code
    private String timeComplexity;
    private String spaceComplexity;
    private List<String> testCases;
    private String acceptance;
    private Integer likes;
    private Integer dislikes;
    private List<String> companyTags;
    private Boolean premium;
    private String frequencyLevel;
    private String contestOrigin;
}
