package com.klu.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "resources")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Auto-generated ID")
    private Long id;

    @Schema(description = "Resource title", example = "AI Workshop Slides")
    private String title;

    @Schema(description = "Resource category", example = "Tech")
    private String category;

    @Schema(description = "Resource description", example = "Presentation slides from the AI workshop")
    private String description;

    @Schema(description = "Resource URL", example = "https://example.com/slides.pdf")
    private String url;

    @Schema(description = "Resource type (PDF, Video, Slides, etc.)", example = "PDF")
    private String type;
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
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
