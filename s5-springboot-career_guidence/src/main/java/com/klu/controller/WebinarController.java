package com.klu.controller;

import com.klu.model.Webinar;
import com.klu.service.WebinarService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/webinars")

public class WebinarController {

    @Autowired
    private WebinarService service;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Webinar> addWebinar(@RequestBody Webinar webinar) {
        Webinar saved = service.add(webinar);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Webinar>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Webinar> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Webinar> update(@PathVariable Long id, @RequestBody Webinar webinar) {
        return ResponseEntity.ok(service.update(id, webinar));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Webinar deleted successfully");
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Webinar>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(service.getByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Webinar>> searchByTitle(@RequestParam String keyword) {
        return ResponseEntity.ok(service.searchByTitle(keyword));
    }

    @GetMapping("/count/{category}")
    public ResponseEntity<Long> countByCategory(@PathVariable String category) {
        return ResponseEntity.ok(service.countByCategory(category));
    }
}