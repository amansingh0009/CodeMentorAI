package com.codementorai.repository;

import com.codementorai.model.Submission;
import com.codementorai.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUser(User user);
}
