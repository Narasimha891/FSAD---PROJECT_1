package com.klu.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.dto.UserRequestDTO;
import com.klu.dto.UserResponseDTO;
import com.klu.exception.ResourceNotFoundException;
import com.klu.model.User;
import com.klu.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private ModelMapper mapper;

    public UserResponseDTO register(UserRequestDTO dto) {
        User user = mapper.map(dto, User.class);
        User saved = repo.save(user);
        return mapper.map(saved, UserResponseDTO.class);
    }

    public List<UserResponseDTO> getAll() {
        return repo.findAll()
                .stream()
                .map(u -> mapper.map(u, UserResponseDTO.class))
                .collect(Collectors.toList());
    }

    public UserResponseDTO login(String email, String password) {

        User u = repo.findByEmail(email);

        if (u == null) {
            throw new ResourceNotFoundException("User not found");
        }

        if (!u.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return mapper.map(u, UserResponseDTO.class);
    }
}