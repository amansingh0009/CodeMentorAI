package com.codementorai.controller;

import com.codementorai.dto.AiReviewRequest;
import com.codementorai.dto.AiReviewResponse;
import com.codementorai.service.AiReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiReviewController {
    private final AiReviewService aiReviewService;

    public AiReviewController(AiReviewService aiReviewService) {
        this.aiReviewService = aiReviewService;
    }

    @PostMapping("/review")
    public ResponseEntity<AiReviewResponse> reviewCode(@Valid @RequestBody AiReviewRequest request) {
        return ResponseEntity.ok(aiReviewService.reviewCode(request));
    }
}
