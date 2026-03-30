package com.toyproject.backend.domain.auth.service;

import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    public OAuth2LoginSuccessHandler() {
        setDefaultTargetUrl("http://localhost:5173");
        setAlwaysUseDefaultTargetUrl(true);
    }
}
