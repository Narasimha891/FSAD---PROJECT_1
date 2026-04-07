package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.klu.model.Registration;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    // Derived query methods
    List<Registration> findByUserId(Long userId);

    List<Registration> findByWebinarId(Long webinarId);

    boolean existsByUserIdAndWebinarId(Long userId, Long webinarId);

    // JPQL custom queries
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.webinarId = :webinarId")
    long countByWebinarId(@Param("webinarId") Long webinarId);

    @Query("SELECT r FROM Registration r WHERE r.userId = :userId ORDER BY r.registeredAt DESC")
    List<Registration> findByUserIdSorted(@Param("userId") Long userId);
}
