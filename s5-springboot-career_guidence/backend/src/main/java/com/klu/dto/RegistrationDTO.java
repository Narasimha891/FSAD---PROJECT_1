package com.klu.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RegistrationDTO {
    @Schema(hidden = true)
    private Long id;

    @Schema(description = "User ID to register", example = "1", required = true)
    private Long userId;

    @Schema(description = "Webinar ID to register for", example = "1", required = true)
    private Long webinarId;

    @Schema(hidden = true)
    private String registeredAt;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getWebinarId() {
        return webinarId;
    }
    public void setWebinarId(Long webinarId) {
        this.webinarId = webinarId;
    }
    public String getRegisteredAt() {
        return registeredAt;
    }
    public void setRegisteredAt(String registeredAt) {
        this.registeredAt = registeredAt;
    }
}
