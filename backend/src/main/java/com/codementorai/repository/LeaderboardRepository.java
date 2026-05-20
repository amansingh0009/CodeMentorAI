package com.codementorai.repository;

import com.codementorai.model.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry, Long> {
    Optional<LeaderboardEntry> findByUserId(Long userId);
}
