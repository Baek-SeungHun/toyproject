package com.toyproject.backend.domain.restaurant.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RestaurantRequest {
    private String name;
    private String category;
    private String address;
    private BigDecimal rating;
    private double[] coordinates;
}
