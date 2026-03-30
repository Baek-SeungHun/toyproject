package com.toyproject.backend.domain.auth.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class User {
    private Long id;
    private String email;
    private String name;
    private String profileImage;
    private String provider;
    private String providerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
