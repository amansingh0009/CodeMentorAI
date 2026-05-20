package com.codementorai.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String difficulty;

    @Column(nullable = false)
    private String sampleInput;

    @Column(nullable = false)
    private String sampleOutput;

    @Column(columnDefinition = "TEXT")
    private String examplesJson;

    @Column(nullable = false)
    private String tags;

    // Additional fields for richer problem metadata
    private String category;

    @Column(columnDefinition = "TEXT")
    private String inputFormat;

    @Column(columnDefinition = "TEXT")
    private String outputFormat;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(columnDefinition = "TEXT")
    private String starterCodeJson; // store starter code per-language as JSON string

    private String timeComplexity;

    private String spaceComplexity;

    @Column(columnDefinition = "TEXT")
    private String testCasesJson; // store test cases as JSON string

    private Double acceptance = 0.0;

    private Integer likes = 0;

    private Integer dislikes = 0;

    @Column(length = 1000)
    private String companyTags; // comma separated

    private Boolean premium = false;

    private String frequencyLevel;

    private String contestOrigin;
}
