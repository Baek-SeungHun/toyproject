package com.toyproject.backend.domain.polygon.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Polygon {
    private Long id;
    private Long userId;
    private String name;
    private String description;
    private String geomJson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
