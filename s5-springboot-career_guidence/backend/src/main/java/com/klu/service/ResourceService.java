package com.klu.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.exception.ResourceNotFoundException;
import com.klu.model.Resource;
import com.klu.repository.ResourceRepository;

@Service
public class ResourceService {

    private static final Logger logger = LoggerFactory.getLogger(ResourceService.class);

    @Autowired
    private ResourceRepository repo;

    public Resource add(Resource resource) {
        resource.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        logger.info("Creating new resource: {}", resource.getTitle());
        return repo.save(resource);
    }

    public List<Resource> getAll() {
        return repo.findAll();
    }

    public Resource getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    public Resource update(Long id, Resource resource) {
        Resource existing = getById(id);
        existing.setTitle(resource.getTitle());
        existing.setCategory(resource.getCategory());
        existing.setDescription(resource.getDescription());
        existing.setUrl(resource.getUrl());
        existing.setType(resource.getType());
        logger.info("Updated resource id: {}", id);
        return repo.save(existing);
    }

    public void delete(Long id) {
        Resource existing = getById(id);
        repo.delete(existing);
        logger.info("Deleted resource id: {}", id);
    }

    public List<Resource> getByCategory(String category) {
        return repo.findByCategory(category);
    }

    public List<Resource> getByType(String type) {
        return repo.findByType(type);
    }

    public List<Resource> search(String keyword) {
        return repo.searchResources(keyword);
    }
}
