package com.vipulpatil.eCommerce.security.oauth;

import com.vipulpatil.eCommerce.dto.LoginResponseDto;
import com.vipulpatil.eCommerce.security.service.AuthService;
import com.vipulpatil.eCommerce.utils.CookieUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthService authService;
    private final CookieUtil cookieUtil;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private static final int COOKIE_AGE = 30 * 24 * 60 * 60;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        try {
            OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String registrationId = authToken.getAuthorizedClientRegistrationId();

            LoginResponseDto loginResponse = authService.handleOAuth2LoginRequest(oAuth2User, registrationId);

            if (loginResponse != null && loginResponse.getRefreshToken() != null) {
                addAuthenticationCookies(response, loginResponse);
                log.info("OAuth2 authentication successful for user: {}",
                        (Object) oAuth2User.getAttribute("email"));
            } else {
                log.error("Failed to generate tokens for OAuth2 user");
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                return;
            }

            response.sendRedirect(frontendUrl + "/products");

        } catch (Exception e) {
            log.error("OAuth2 authentication failed", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private void addAuthenticationCookies(HttpServletResponse response, LoginResponseDto loginResponse) {
        Cookie accessCookie = cookieUtil.create("accessToken", loginResponse.getAccessToken(),
                COOKIE_AGE);
        Cookie refreshCookie = cookieUtil.create("refreshToken", loginResponse.getRefreshToken(),
                COOKIE_AGE);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);
    }
}