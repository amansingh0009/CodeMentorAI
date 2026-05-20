package com.codementorai.config;

import com.codementorai.model.Question;
import com.codementorai.model.Role;
import com.codementorai.model.User;
import com.codementorai.repository.QuestionRepository;
import com.codementorai.repository.UserRepository;
import com.codementorai.service.QuestionService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Set;

@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, QuestionRepository questionRepository, QuestionService questionService, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(User.builder()
                        .username("admin")
                        .email("admin@codementor.ai")
                        .password(passwordEncoder.encode("Admin@123"))
                        .roles(Set.of(Role.ROLE_ADMIN, Role.ROLE_USER))
                        .createdAt(LocalDateTime.now())
                        .build());

                userRepository.save(User.builder()
                        .username("candidate")
                        .email("candidate@codementor.ai")
                        .password(passwordEncoder.encode("Candidate@123"))
                        .roles(Set.of(Role.ROLE_USER))
                        .createdAt(LocalDateTime.now())
                        .build());
            }
            // always reload questions.json into the database (useful for development)
            try (java.io.InputStream is = openQuestionsJson()) {
                if (is != null) {
                    com.fasterxml.jackson.databind.ObjectMapper om = new com.fasterxml.jackson.databind.ObjectMapper();
                    java.util.List<com.codementorai.dto.QuestionDto> list = om.readValue(is, new com.fasterxml.jackson.core.type.TypeReference<java.util.List<com.codementorai.dto.QuestionDto>>(){});
                    // clear existing questions then insert
                    questionRepository.deleteAll();
                    for (com.codementorai.dto.QuestionDto dto : list) {
                        questionService.createQuestion(dto);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        };
    }

    private java.io.InputStream openQuestionsJson() {
        java.io.InputStream is = DataLoader.class.getResourceAsStream("/questions.json");
        return is != null ? is : DataLoader.class.getResourceAsStream("/data/questions.json");
    }
}
