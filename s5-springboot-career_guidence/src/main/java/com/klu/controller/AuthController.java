package com.klu.controller;

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
public class AuthController {

    @Autowired
    private UserService service;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserRequestDTO dto){
        UserResponseDTO user = service.register(dto);
        // Send welcome email asynchronously
        emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto){
        try {
            UserResponseDTO user = service.login(dto.getEmail(), dto.getPassword());
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            return ResponseEntity.ok(
                java.util.Map.of(
                    "user", user,
                    "token", token
                )
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}