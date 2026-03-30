package com.toyproject.backend.domain.polygon.controller;

import com.toyproject.backend.common.dto.ApiResponse;
import com.toyproject.backend.domain.auth.entity.User;
import com.toyproject.backend.domain.auth.mapper.UserMapper;
import com.toyproject.backend.domain.polygon.dto.PolygonRequest;
import com.toyproject.backend.domain.polygon.dto.PolygonResponse;
import com.toyproject.backend.domain.polygon.service.PolygonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/polygons")
@RequiredArgsConstructor
public class PolygonController {

    private final PolygonService polygonService;
    private final UserMapper userMapper;

    @PostMapping
    public ResponseEntity<ApiResponse<PolygonResponse>> create(
            @AuthenticationPrincipal OAuth2User oAuth2User,
            @RequestBody PolygonRequest request) {
        Long userId = getUserId(oAuth2User);
        PolygonResponse response = polygonService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PolygonResponse>>> list(
            @AuthenticationPrincipal OAuth2User oAuth2User) {
        Long userId = getUserId(oAuth2User);
        List<PolygonResponse> responses = polygonService.findByUserId(userId);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PolygonResponse>> get(@PathVariable Long id) {
        PolygonResponse response = polygonService.findById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> delete(
            @AuthenticationPrincipal OAuth2User oAuth2User,
            @PathVariable Long id) {
        Long userId = getUserId(oAuth2User);
        polygonService.delete(id, userId);
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
