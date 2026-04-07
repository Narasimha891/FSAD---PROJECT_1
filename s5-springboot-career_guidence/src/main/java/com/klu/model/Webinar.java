package com.klu.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Webinar {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Auto-generated ID")
    private Long id;

    @Schema(description = "Webinar title", example = "Introduction to AI")
    private String title;

    @Schema(description = "Webinar category", example = "Tech")
    private String category;

    @Schema(description = "Webinar description", example = "An introductory session on Artificial Intelligence")
    private String description;

    @Schema(description = "Speaker name", example = "Dr. Jane Smith")
    private String speaker;

    @Schema(description = "Webinar date (YYYY-MM-DD)", example = "2026-05-15")
    private String date;

    @Schema(description = "Image file path", example = "webinar.jpg", nullable = true)
    private String imagePath;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Auto-generated timestamp")
    private String createdAt;

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getSpeaker() {
		return speaker;
	}
	public void setSpeaker(String speaker) {
		this.speaker = speaker;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getImagePath() {
		return imagePath;
	}
	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}
	public String getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}
    
}
