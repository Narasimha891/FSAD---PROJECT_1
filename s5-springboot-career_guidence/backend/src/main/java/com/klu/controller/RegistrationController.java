package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.klu.dto.RegistrationDTO;
import com.klu.model.Registration;
import com.klu.service.RegistrationService;

@RestController
@RequestMapping("/api/registrations")

public class RegistrationController {

    @Autowired
    private RegistrationService service;

    @PostMapping
    public ResponseEntity<Registration> register(@RequestBody RegistrationDTO dto) {
        Registration saved = service.register(dto.getUserId(), dto.getWebinarId());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Registration>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    @GetMapping("/webinar/{webinarId}")
    public ResponseEntity<List<Registration>> getByWebinar(@PathVariable Long webinarId) {
        return ResponseEntity.ok(service.getByWebinarId(webinarId));
    }

    @GetMapping("/count/{webinarId}")
    public ResponseEntity<Long> countByWebinar(@PathVariable Long webinarId) {
        return ResponseEntity.ok(service.countByWebinar(webinarId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancel(@PathVariable Long id) {
        service.cancel(id);
        return ResponseEntity.ok("Registration cancelled successfully");
    }

    @GetMapping
    public ResponseEntity<List<Registration>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
