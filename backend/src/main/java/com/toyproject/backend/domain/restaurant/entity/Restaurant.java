package com.toyproject.backend.domain.restaurant.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class Restaurant {
    private Long id;
    private Long userId;
    private String name;
    private String category;
    private String address;
    private BigDecimal rating;
    private Double longitude;
    private Double latitude;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
