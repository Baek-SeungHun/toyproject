package com.toyproject.backend.domain.restaurant.controller;

import com.toyproject.backend.common.dto.ApiResponse;
import com.toyproject.backend.domain.auth.entity.User;
import com.toyproject.backend.domain.auth.mapper.UserMapper;
import com.toyproject.backend.domain.restaurant.dto.RestaurantRequest;
import com.toyproject.backend.domain.restaurant.dto.RestaurantResponse;
import com.toyproject.backend.domain.restaurant.dto.RestaurantSearchRequest;
import com.toyproject.backend.domain.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final UserMapper userMapper;

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> search(
            @RequestBody RestaurantSearchRequest request) {
        List<RestaurantResponse> responses = restaurantService.search(request);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RestaurantResponse>> create(
            @AuthenticationPrincipal OAuth2User oAuth2User,
            @RequestBody RestaurantRequest request) {
        Long userId = getUserId(oAuth2User);
        RestaurantResponse response = restaurantService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantResponse>> update(
            @AuthenticationPrincipal OAuth2User oAuth2User,
            @PathVariable Long id,
            @RequestBody RestaurantRequest request) {
        Long userId = getUserId(oAuth2User);
        RestaurantResponse response = restaurantService.update(id, userId, request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> delete(
            @AuthenticationPrincipal OAuth2User oAuth2User,
            @PathVariable Long id) {
        Long userId = getUserId(oAuth2User);
        restaurantService.delete(id, userId);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제되었습니다"));
    }

    private Long getUserId(OAuth2User oAuth2User) {
        String providerId = oAuth2User.getAttribute("sub");
        User user = userMapper.findByProviderAndProviderId("google", providerId);
        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다");
        }
        return user.getId();
    }
}
