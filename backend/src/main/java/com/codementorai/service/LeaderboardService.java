package com.codementorai.service;

import com.codementorai.model.LeaderboardEntry;
import com.codementorai.model.User;
import com.codementorai.repository.LeaderboardRepository;
import org.springframework.stereotype.Service;

@Service
public class LeaderboardService {
    private final LeaderboardRepository leaderboardRepository;

    public LeaderboardService(LeaderboardRepository leaderboardRepository) {
        this.leaderboardRepository = leaderboardRepository;
    }

    public void updateLeaderboard(User user, Integer score) {
        LeaderboardEntry entry = leaderboardRepository.findByUserId(user.getId()).orElseGet(() -> LeaderboardEntry.builder()
                .user(user)
                .totalScore(0)
                .solvedQuestions(0)
                .build());
        entry.setTotalScore(entry.getTotalScore() + (score != null ? score : 0));
        entry.setSolvedQuestions(entry.getSolvedQuestions() + 1);
        leaderboardRepository.save(entry);
    }
}
