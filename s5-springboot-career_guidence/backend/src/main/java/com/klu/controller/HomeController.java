package com.klu.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Root health-check endpoint.
 * Useful for Render to verify the backend is up and running.
 */
@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Backend Running";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
