package com.klu.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import com.klu.model.User;
import com.klu.repository.UserRepository;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "kusadhiharshit@gmail.com";
        
        if (userRepository.findByEmail(adminEmail) == null) {
            User admin = new User();
            admin.setName("harshit");
            admin.setEmail(adminEmail);
            admin.setPhone("9533413399");
            admin.setPassword("545360");
            admin.setRole("admin");
            
            userRepository.save(admin);
            System.out.println("Admin user created: " + adminEmail);
        } else {
            System.out.println("Admin user already exists: " + adminEmail);
        }
    }
}
