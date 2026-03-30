package com.toyproject.backend.domain.auth.service;

import com.toyproject.backend.domain.auth.entity.User;
import com.toyproject.backend.domain.auth.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserMapper userMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String profileImage = oAuth2User.getAttribute("picture");

        User user = userMapper.findByProviderAndProviderId(provider, providerId);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setProfileImage(profileImage);
            user.setProvider(provider);
            user.setProviderId(providerId);
            userMapper.insert(user);
        } else {
            user.setName(name);
            user.setProfileImage(profileImage);
            userMapper.update(user);
        }

        return new DefaultOAuth2User(
            oAuth2User.getAuthorities(),
            oAuth2User.getAttributes(),
            "sub"
        );
    }
}
