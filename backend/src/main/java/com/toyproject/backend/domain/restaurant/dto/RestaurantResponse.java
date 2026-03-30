package com.toyproject.backend.domain.restaurant.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RestaurantResponse {
    private String id;
    private String name;
    private String category;
    private String address;
    private BigDecimal rating;
    private double[] coordinates;
}
