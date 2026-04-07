package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.klu.model.Resource;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByCategory(String category);

    List<Resource> findByType(String type);

    List<Resource> findByTitleContainingIgnoreCase(String keyword);

    @Query("SELECT r FROM Resource r WHERE LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Resource> searchResources(@Param("keyword") String keyword);
}
