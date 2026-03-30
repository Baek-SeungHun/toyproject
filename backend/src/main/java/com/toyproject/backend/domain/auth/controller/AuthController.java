package com.toyproject.backend.domain.auth.controller;

import com.toyproject.backend.common.dto.ApiResponse;
import com.toyproject.backend.domain.auth.entity.User;
import com.toyproject.backend.domain.auth.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> me(@AuthenticationPrincipal OAuth2User oAuth2User) {
        if (oAuth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증이 필요합니다"));
        }

        String providerId = oAuth2User.getAttribute("sub");
        User user = userMapper.findByProviderAndProviderId("google", providerId);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("사용자를 찾을 수 없습니다"));
        }

        Map<String, Object> userData = Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "name", user.getName(),
            "profileImage", user.getProfileImage() != null ? user.getProfileImage() : ""
        );

        return ResponseEntity.ok(ApiResponse.ok(userData));
    }
}
