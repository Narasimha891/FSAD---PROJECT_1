package com.klu.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.Webinar;
import com.klu.repository.WebinarRepository;

@Service
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);

    @Autowired
    private WebinarRepository webinarRepo;

    /**
     * Simple recommendation: returns webinars in the same category,
     * excluding the current one.
     */
    public List<Webinar> getRecommendations(Long webinarId) {
        Webinar current = webinarRepo.findById(webinarId).orElse(null);
        if (current == null) {
            return List.of();
        }

        List<Webinar> recommendations = webinarRepo.findByCategory(current.getCategory())
                .stream()
                .filter(w -> !w.getId().equals(webinarId))
                .limit(5)
                .collect(Collectors.toList());

        logger.info("Found {} recommendations for webinar {}", recommendations.size(), webinarId);
        return recommendations;
    }
}
