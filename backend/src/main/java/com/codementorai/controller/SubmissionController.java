package com.codementorai.controller;

import com.codementorai.dto.SubmissionRequest;
import com.codementorai.model.Submission;
import com.codementorai.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {
    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @GetMapping
    public ResponseEntity<List<Submission>> getSubmissions() {
        return ResponseEntity.ok(submissionService.getUserSubmissions());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Submission>> getAllSubmissions() {
        return ResponseEntity.ok(submissionService.getAllSubmissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmission(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmission(id));
    }

    @PostMapping
    public ResponseEntity<Submission> submitCode(@Valid @RequestBody SubmissionRequest request) {
        return ResponseEntity.ok(submissionService.submit(request));
    }
}
