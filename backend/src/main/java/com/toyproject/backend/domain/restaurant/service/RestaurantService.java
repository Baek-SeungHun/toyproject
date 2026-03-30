package com.toyproject.backend.domain.restaurant.service;

import tools.jackson.databind.ObjectMapper;
import com.toyproject.backend.domain.restaurant.dto.RestaurantRequest;
import com.toyproject.backend.domain.restaurant.dto.RestaurantResponse;
import com.toyproject.backend.domain.restaurant.dto.RestaurantSearchRequest;
import com.toyproject.backend.domain.restaurant.entity.Restaurant;
import com.toyproject.backend.domain.restaurant.mapper.RestaurantMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantMapper restaurantMapper;
    private final ObjectMapper objectMapper;

    public List<RestaurantResponse> search(RestaurantSearchRequest request) {
        try {
            String geoJson = objectMapper.writeValueAsString(request.getGeometry());
            List<Restaurant> restaurants = restaurantMapper.findInPolygon(geoJson);
            return restaurants.stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("맛집 검색 실패", e);
        }
    }

    public RestaurantResponse create(Long userId, RestaurantRequest request) {
        Restaurant restaurant = new Restaurant();
        restaurant.setUserId(userId);
        restaurant.setName(request.getName());
        restaurant.setCategory(request.getCategory());
        restaurant.setAddress(request.getAddress());
        restaurant.setRating(request.getRating());
        restaurant.setLongitude(request.getCoordinates()[0]);
        restaurant.setLatitude(request.getCoordinates()[1]);

        restaurantMapper.insert(restaurant);

        Restaurant saved = restaurantMapper.findById(restaurant.getId());
        return toResponse(saved);
    }

    public RestaurantResponse update(Long id, Long userId, RestaurantRequest request) {
        Restaurant restaurant = new Restaurant();
        restaurant.setId(id);
        restaurant.setUserId(userId);
        restaurant.setName(request.getName());
        restaurant.setCategory(request.getCategory());
        restaurant.setAddress(request.getAddress());
        restaurant.setRating(request.getRating());
        restaurant.setLongitude(request.getCoordinates()[0]);
        restaurant.setLatitude(request.getCoordinates()[1]);

        int updated = restaurantMapper.update(restaurant);
        if (updated == 0) {
            throw new IllegalArgumentException("수정할 맛집이 없거나 권한이 없습니다");
        }

        Restaurant saved = restaurantMapper.findById(id);
        return toResponse(saved);
    }

    public void delete(Long id, Long userId) {
        int deleted = restaurantMapper.deleteById(id, userId);
        if (deleted == 0) {
            throw new IllegalArgumentException("삭제할 맛집이 없거나 권한이 없습니다");
        }
    }

    private RestaurantResponse toResponse(Restaurant restaurant) {
        RestaurantResponse response = new RestaurantResponse();
        response.setId(String.valueOf(restaurant.getId()));
        response.setName(restaurant.getName());
        response.setCategory(restaurant.getCategory());
        response.setAddress(restaurant.getAddress());
        response.setRating(restaurant.getRating());
        response.setCoordinates(new double[]{restaurant.getLongitude(), restaurant.getLatitude()});
        return response;
    }
}
