package com.toyproject.backend.domain.polygon.dto;

import lombok.Data;

@Data
public class PolygonRequest {
    private String name;
    private String description;
    private Object geoJson;
}
