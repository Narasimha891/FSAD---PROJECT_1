package com.klu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration for Render deployment.
 *
 * All API endpoints are open (permitAll) for testing / initial deployment.
 * JWT filter is intentionally NOT added here so no request is blocked.
 * CSRF is disabled (stateless REST API).
 * Role restrictions are removed until authentication is properly wired.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // Delegate CORS to CorsConfig / CorsFilter bean
            .cors(cors -> {})
            // Disable CSRF – not needed for stateless REST APIs
            .csrf(csrf -> csrf.disable())
            // Stateless session – no HTTP session will be created
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Permit every request – no authentication required for now
            .authorizeHttpRequests(auth ->
                auth.anyRequest().permitAll()
            );

        // NOTE: JwtFilter is deliberately NOT added here.
        // Re-add it once authentication is required:
        //   .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

        return http.build();
    }
}