package com.codementorai.repository;

import com.codementorai.model.AiFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AiFeedbackRepository extends JpaRepository<AiFeedback, Long> {
    Optional<AiFeedback> findBySubmissionId(Long submissionId);
}
