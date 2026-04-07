package com.klu.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.exception.ResourceNotFoundException;
import com.klu.model.Registration;
import com.klu.repository.RegistrationRepository;

@Service
public class RegistrationService {

    private static final Logger logger = LoggerFactory.getLogger(RegistrationService.class);

    @Autowired
    private RegistrationRepository repo;

    @Autowired
    private EmailService emailService;

    public Registration register(Long userId, Long webinarId) {
        // Check if already registered
        if (repo.existsByUserIdAndWebinarId(userId, webinarId)) {
            throw new RuntimeException("User is already registered for this webinar");
        }

        Registration reg = new Registration();
        reg.setUserId(userId);
        reg.setWebinarId(webinarId);
        reg.setRegisteredAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        Registration saved = repo.save(reg);
        logger.info("User {} registered for webinar {}", userId, webinarId);

        return saved;
    }

    public List<Registration> getByUserId(Long userId) {
        return repo.findByUserId(userId);
    }

    public List<Registration> getByWebinarId(Long webinarId) {
        return repo.findByWebinarId(webinarId);
    }

    public long countByWebinar(Long webinarId) {
        return repo.countByWebinarId(webinarId);
    }

    public void cancel(Long id) {
        Registration reg = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id));
        repo.delete(reg);
        logger.info("Cancelled registration id: {}", id);
    }

    public List<Registration> getAll() {
        return repo.findAll();
    }
}
