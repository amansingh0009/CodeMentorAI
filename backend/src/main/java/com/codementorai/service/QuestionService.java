package com.codementorai.service;

import com.codementorai.dto.QuestionDto;
import com.codementorai.exception.ResourceNotFoundException;
import com.codementorai.model.Question;
import com.codementorai.repository.QuestionRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<QuestionDto> getAllQuestions() {
        return questionRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public QuestionDto getQuestionById(Long id) {
        return questionRepository.findById(id).map(this::mapToDto).orElseThrow(() -> new ResourceNotFoundException("Question not found"));
    }

    public QuestionDto createQuestion(QuestionDto dto) {
        String starterJson = null;
        String testCasesJson = null;
        String examplesJson = null;
        try {
            if (dto.getStarterCode() != null) starterJson = OBJECT_MAPPER.writeValueAsString(dto.getStarterCode());
            if (dto.getTestCases() != null) testCasesJson = OBJECT_MAPPER.writeValueAsString(dto.getTestCases());
            if (dto.getExamples() != null) examplesJson = OBJECT_MAPPER.writeValueAsString(dto.getExamples());
        } catch (Exception ignored) {}

        Question question = Question.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .difficulty(dto.getDifficulty())
                .category(dto.getCategory())
                .inputFormat(dto.getInputFormat())
                .outputFormat(dto.getOutputFormat())
                .constraints(toMultiline(dto.getConstraints()))
                .sampleInput(firstPresent(dto.getSampleInput(), firstExampleInput(dto)))
                .sampleOutput(firstPresent(dto.getSampleOutput(), firstExampleOutput(dto)))
                .examplesJson(examplesJson)
                .tags(dto.getTags() == null ? "" : String.join(",", dto.getTags()))
                .starterCodeJson(starterJson)
                .timeComplexity(dto.getTimeComplexity())
                .spaceComplexity(dto.getSpaceComplexity())
                .testCasesJson(testCasesJson)
                .acceptance(parseAcceptance(dto.getAcceptance()))
                .likes(dto.getLikes())
                .dislikes(dto.getDislikes())
                .companyTags(dto.getCompanyTags() == null ? null : String.join(",", dto.getCompanyTags()))
                .premium(dto.getPremium())
                .frequencyLevel(dto.getFrequencyLevel())
                .contestOrigin(dto.getContestOrigin())
                .build();
        return mapToDto(questionRepository.save(question));
    }

    public QuestionDto updateQuestion(Long id, QuestionDto dto) {
        Question question = questionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        question.setTitle(dto.getTitle());
        question.setDescription(dto.getDescription());
        question.setDifficulty(dto.getDifficulty());
        question.setCategory(dto.getCategory());
        question.setInputFormat(dto.getInputFormat());
        question.setOutputFormat(dto.getOutputFormat());
        question.setConstraints(toMultiline(dto.getConstraints()));
        question.setSampleInput(firstPresent(dto.getSampleInput(), firstExampleInput(dto)));
        question.setSampleOutput(firstPresent(dto.getSampleOutput(), firstExampleOutput(dto)));
        question.setTags(dto.getTags() == null ? "" : String.join(",", dto.getTags()));
        try {
            question.setStarterCodeJson(dto.getStarterCode() == null ? null : OBJECT_MAPPER.writeValueAsString(dto.getStarterCode()));
            question.setTestCasesJson(dto.getTestCases() == null ? null : OBJECT_MAPPER.writeValueAsString(dto.getTestCases()));
            question.setExamplesJson(dto.getExamples() == null ? null : OBJECT_MAPPER.writeValueAsString(dto.getExamples()));
        } catch (JsonProcessingException e) {
            // ignore
        }
        question.setTimeComplexity(dto.getTimeComplexity());
        question.setSpaceComplexity(dto.getSpaceComplexity());
        question.setAcceptance(parseAcceptance(dto.getAcceptance()));
        question.setLikes(dto.getLikes());
        question.setDislikes(dto.getDislikes());
        question.setCompanyTags(dto.getCompanyTags() == null ? null : String.join(",", dto.getCompanyTags()));
        question.setPremium(dto.getPremium());
        question.setFrequencyLevel(dto.getFrequencyLevel());
        question.setContestOrigin(dto.getContestOrigin());
        return mapToDto(questionRepository.save(question));
    }

    public void deleteQuestion(Long id) {
        questionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        questionRepository.deleteById(id);
    }

    public void reseedQuestionsFromClasspath() {
        try (java.io.InputStream is = openQuestionsJson()) {
            if (is != null) {
                java.util.List<com.codementorai.dto.QuestionDto> list = OBJECT_MAPPER.readValue(is, new TypeReference<java.util.List<com.codementorai.dto.QuestionDto>>(){});
                // clear existing questions and re-insert
                questionRepository.deleteAll();
                for (com.codementorai.dto.QuestionDto dto : list) {
                    // reuse createQuestion to persist each DTO
                    try {
                        createQuestion(dto);
                    } catch (Exception ignored) {
                        // continue on errors for individual entries
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to reseed questions", e);
        }
    }

    private QuestionDto mapToDto(Question question) {
        QuestionDto dto = new QuestionDto();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setDescription(question.getDescription());
        dto.setDifficulty(question.getDifficulty());
        dto.setCategory(question.getCategory());
        dto.setInputFormat(question.getInputFormat());
        dto.setOutputFormat(question.getOutputFormat());
        dto.setConstraints(fromMultiline(question.getConstraints()));
        dto.setSampleInput(question.getSampleInput());
        dto.setSampleOutput(question.getSampleOutput());
        dto.setTags(question.getTags() == null ? java.util.List.of() : Arrays.stream(question.getTags().split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList());
        try {
            if (question.getStarterCodeJson() != null) {
                dto.setStarterCode(OBJECT_MAPPER.readValue(question.getStarterCodeJson(), new TypeReference<Map<String, String>>() {}));
            }
            if (question.getTestCasesJson() != null) {
                dto.setTestCases(OBJECT_MAPPER.readValue(question.getTestCasesJson(), new TypeReference<List<String>>() {}));
            }
            if (question.getExamplesJson() != null) {
                dto.setExamples(OBJECT_MAPPER.readValue(question.getExamplesJson(), new TypeReference<List<com.codementorai.dto.QuestionExampleDto>>() {}));
            }
        } catch (Exception e) {
            // ignore parsing errors
        }
        dto.setTimeComplexity(question.getTimeComplexity());
        dto.setSpaceComplexity(question.getSpaceComplexity());
        dto.setAcceptance(formatAcceptance(question.getAcceptance()));
        dto.setLikes(question.getLikes());
        dto.setDislikes(question.getDislikes());
        dto.setCompanyTags(question.getCompanyTags() == null ? java.util.List.of() : Arrays.stream(question.getCompanyTags().split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList());
        dto.setPremium(question.getPremium());
        dto.setFrequencyLevel(question.getFrequencyLevel());
        dto.setContestOrigin(question.getContestOrigin());
        return dto;
    }

    private String toMultiline(List<String> values) {
        return values == null ? null : String.join("\n", values);
    }

    private List<String> fromMultiline(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        return Arrays.stream(value.split("\\R")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }

    private Double parseAcceptance(String value) {
        if (value == null || value.isBlank()) {
            return 0.0;
        }
        try {
            return Double.parseDouble(value.replace("%", "").trim());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private java.io.InputStream openQuestionsJson() {
        java.io.InputStream is = QuestionService.class.getResourceAsStream("/questions.json");
        return is != null ? is : QuestionService.class.getResourceAsStream("/data/questions.json");
    }

    private String formatAcceptance(Double value) {
        return value == null ? "0.0%" : String.format(java.util.Locale.US, "%.1f%%", value);
    }

    private String firstPresent(String preferred, String fallback) {
        return preferred == null || preferred.isBlank() ? fallback : preferred;
    }

    private String firstExampleInput(QuestionDto dto) {
        return dto.getExamples() == null || dto.getExamples().isEmpty() ? "" : dto.getExamples().get(0).getInput();
    }

    private String firstExampleOutput(QuestionDto dto) {
        return dto.getExamples() == null || dto.getExamples().isEmpty() ? "" : dto.getExamples().get(0).getOutput();
    }
}
