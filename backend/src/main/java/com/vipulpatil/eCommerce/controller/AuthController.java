package com.vipulpatil.eCommerce.controller;

import com.vipulpatil.eCommerce.dto.LoginRequestDto;
import com.vipulpatil.eCommerce.dto.LoginResponseDto;
import com.vipulpatil.eCommerce.dto.SignupRequestDto;
import com.vipulpatil.eCommerce.dto.SignupResponseDto;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.security.service.AuthService;
import com.vipulpatil.eCommerce.security.service.JwtService;
import com.vipulpatil.eCommerce.service.RefreshTokenService;
import com.vipulpatil.eCommerce.utils.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final CookieUtil cookieUtil;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    private static final int COOKIE_AGE = 30 * 24 * 60 * 60;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @RequestBody LoginRequestDto loginRequestDto,
            HttpServletResponse response) {

        LoginResponseDto loginResponse = authService.login(loginRequestDto);
        addAuthCookies(response, loginResponse);
        log.info("User login successful: {}", loginRequestDto.getUsername());

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(
            @RequestBody SignupRequestDto signupRequestDto) {

        SignupResponseDto signupResponse = authService.signup(signupRequestDto);
        log.info("User signup successful: {}", signupRequestDto.getUsername());

        return ResponseEntity.ok(signupResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDto> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) {

        String refreshTokenValue = jwtService.getValue(request);
        log.info("Received refreshToken cookie: {}", refreshTokenValue);

        if (refreshTokenValue == null) {
            log.warn("Refresh attempt without valid refresh token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            LoginResponseDto loginResponse = authService.refreshToken(refreshTokenValue);
            addAuthCookies(response, loginResponse);
            log.info("Token refresh successful");

            return ResponseEntity.ok(loginResponse);

        } catch (RuntimeException e) {
            log.warn("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/state")
    public ResponseEntity<Map<String, Object>> getAuthState(
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {

        if (refreshToken == null || refreshToken.isBlank()) {
            log.debug("Auth state check: no refresh token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            var verifiedToken = refreshTokenService.verifyRefreshToken(refreshToken);
            User user = verifiedToken.getUser();

            Map<String, Object> state = new HashMap<>();
            state.put("authenticated", true);
            state.put("email", user.getUsername());
            state.put("userId", user.getId());
            state.put("roles", user.getRoles());

            log.debug("Auth state retrieved for user: {}", user.getUsername());
            return ResponseEntity.ok(state);

        } catch (Exception e) {
            log.warn("Auth state check failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.isAuthenticated()) {
                User user = (User) authentication.getPrincipal();
                refreshTokenService.deleteRefreshTokenByUser(user);
                log.info("User logout successful: {}", user.getUsername());
            }

            clearAuthCookies(response);
            return ResponseEntity.ok(Map.of("message", "Logout successful"));

        } catch (Exception e) {
            log.error("Logout failed", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    private void addAuthCookies(HttpServletResponse response, LoginResponseDto loginResponse) {
        addAccessTokenCookie(response, loginResponse.getAccessToken());
        response.addCookie(cookieUtil.create("refreshToken", loginResponse.getRefreshToken(),
                COOKIE_AGE));
    }

    private void addAccessTokenCookie(HttpServletResponse response, String accessToken) {
        response.addCookie(cookieUtil.create("accessToken", accessToken, COOKIE_AGE));
    }

    private void clearAuthCookies(HttpServletResponse response) {
        response.addCookie(cookieUtil.create("accessToken", "", 0));
        response.addCookie(cookieUtil.create("refreshToken", "", 0));
    }
}