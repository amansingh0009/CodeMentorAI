package com.codementorai.controller;

import com.codementorai.dto.CodeExecutionRequest;
import com.codementorai.dto.CodeExecutionResponse;
import com.codementorai.service.CodeExecutionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/code")
public class CodeExecutionController {
    private final CodeExecutionService codeExecutionService;

    public CodeExecutionController(CodeExecutionService codeExecutionService) {
        this.codeExecutionService = codeExecutionService;
    }

    @PostMapping("/run")
    public ResponseEntity<CodeExecutionResponse> runCode(@Valid @RequestBody CodeExecutionRequest request) {
        return ResponseEntity.ok(codeExecutionService.run(request));
    }
}
