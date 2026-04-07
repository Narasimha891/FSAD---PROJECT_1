package com.klu.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.klu.dto.UserRequestDTO;
import com.klu.dto.UserResponseDTO;
import com.klu.util.JwtUtil;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    public UserResponseDTO register(UserRequestDTO dto) {
        logger.info("Registering new user: {}", dto.getEmail());
        return userService.register(dto);
    }

    public String login(String email, String password) {
        UserResponseDTO user = userService.login(email, password);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        logger.info("User logged in: {}", email);
        return token;
    }
}
