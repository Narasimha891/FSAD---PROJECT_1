package com.klu.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.klu.exception.ResourceNotFoundException;
import com.klu.model.Webinar;
import com.klu.repository.WebinarRepository;

@Service
public class WebinarService {

    private static final Logger logger = LoggerFactory.getLogger(WebinarService.class);

    @Autowired
    private WebinarRepository repo;

    public Webinar add(Webinar w) {
        w.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        logger.info("Creating new webinar: {}", w.getTitle());
        return repo.save(w);
    }

    public List<Webinar> getAll() {
        return repo.findAll();
    }

    public Webinar getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Webinar not found with id: " + id));
    }

    public Webinar update(Long id, Webinar webinar) {
        Webinar existing = getById(id);
        existing.setTitle(webinar.getTitle());
        existing.setCategory(webinar.getCategory());
        existing.setDescription(webinar.getDescription());
        existing.setSpeaker(webinar.getSpeaker());
        existing.setDate(webinar.getDate());
        if (webinar.getImagePath() != null) {
            existing.setImagePath(webinar.getImagePath());
        }
        logger.info("Updated webinar id: {}", id);
        return repo.save(existing);
    }

    public void delete(Long id) {
        Webinar existing = getById(id);
        repo.delete(existing);
        logger.info("Deleted webinar id: {}", id);
    }

    // Derived query methods
    public List<Webinar> getByCategory(String category) {
        return repo.findByCategory(category);
    }

    public List<Webinar> searchByTitle(String keyword) {
        return repo.findByTitleContainingIgnoreCase(keyword);
    }

    public long countByCategory(String category) {
        return repo.countByCategory(category);
    }

    public List<Webinar> getBySpeaker(String speaker) {
        return repo.findBySpeaker(speaker);
    }

    // JPQL query methods
    public List<Webinar> searchWebinars(String keyword) {
        return repo.searchWebinars(keyword);
    }

    // Pagination support
    public Page<Webinar> getAllPaged(Pageable pageable) {
        return repo.findAll(pageable);
    }
}
