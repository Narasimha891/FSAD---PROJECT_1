package com.klu.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.klu.dto.LoginDTO;
import com.klu.dto.UserRequestDTO;
import com.klu.dto.UserResponseDTO;
import com.klu.service.EmailService;
import com.klu.service.UserService;
import com.klu.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService service;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserRequestDTO dto){
        try {
            UserResponseDTO user = service.register(dto);
            // Send welcome email asynchronously
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Registration failed for {}: {}", dto.getEmail(), e.getMessage());
            throw e;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto){
        try {
            logger.debug("Login attempt for email: {}", dto.getEmail());
            UserResponseDTO user = service.login(dto.getEmail(), dto.getPassword());
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            
            logger.info("User {} logged in successfully with role {}", user.getEmail(), user.getRole());
            
            return ResponseEntity.ok(
                java.util.Map.of(
                    "user", user,
                    "token", token
                )
            );
        } catch (Exception e) {
            logger.error("Login failed for email {}: {}", dto.getEmail(), e.getMessage());
            // If it's a known resource not found or runtime exception from UserService, return 401
            // Otherwise it might be a DB error which should ideally be a 500
            return ResponseEntity.status(401).body("Invalid credentials or user not found");
        }
    }
}