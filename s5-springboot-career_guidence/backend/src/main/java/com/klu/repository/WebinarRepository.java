package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.klu.model.Webinar;

public interface WebinarRepository extends JpaRepository<Webinar, Long> {

    // Derived query methods
    List<Webinar> findByCategory(String category);

    List<Webinar> findByTitleContainingIgnoreCase(String keyword);

    List<Webinar> findBySpeaker(String speaker);

    long countByCategory(String category);

    // JPQL custom queries
    @Query("SELECT w FROM Webinar w WHERE w.category = :category ORDER BY w.date DESC")
    List<Webinar> findByCategorySorted(@Param("category") String category);

    @Query("SELECT w FROM Webinar w WHERE LOWER(w.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(w.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Webinar> searchWebinars(@Param("keyword") String keyword);

    @Query("SELECT COUNT(w) FROM Webinar w WHERE w.category = :category")
    long countWebinarsByCategory(@Param("category") String category);

    @Modifying
    @Query("DELETE FROM Webinar w WHERE w.category = :category")
    void deleteByCategory(@Param("category") String category);
}
