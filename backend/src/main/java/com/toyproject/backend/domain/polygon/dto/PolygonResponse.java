package com.toyproject.backend.domain.polygon.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PolygonResponse {
    private String id;
    private String name;
    private String description;
    private Object geoJson;
    private LocalDateTime createdAt;
}
