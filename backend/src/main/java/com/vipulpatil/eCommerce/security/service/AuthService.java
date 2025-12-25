package com.vipulpatil.eCommerce.security.service;

import com.vipulpatil.eCommerce.dto.*;
import com.vipulpatil.eCommerce.entity.RefreshToken;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.entity.type.AuthProviderType;
import com.vipulpatil.eCommerce.entity.type.RoleType;
import com.vipulpatil.eCommerce.repository.UserRepository;
import com.vipulpatil.eCommerce.security.AuthUtil;
import com.vipulpatil.eCommerce.service.RefreshTokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AuthUtil authUtil;
    private final RefreshTokenService refreshTokenService;

    @Cacheable(value = "state", key = "#refreshToken", condition = "#refreshToken != null && !#refreshToken.isBlank()")
    public UserDto getAuthState(String refreshToken) {

        if (refreshToken == null || refreshToken.isBlank()) {
            return new UserDto(false, null, null, null, List.of());
        }

        try {
            RefreshToken token =
                    refreshTokenService.verifyRefreshToken(refreshToken);

            User user = token.getUser();

            return new UserDto(
                    true,
                    user.getId(),
                    user.getName(),
                    user.getUsername(),
                    user.getRoles()
                            .stream()
                            .map(Enum::name)
                            .toList()
            );

        } catch (Exception e) {
            return new UserDto(false, null, null, null, List.of());
        }
    }

    @CacheEvict(value = "state", key = "#refreshToken")
    public void evictAuthState(String refreshToken) {

    }

    @Transactional
    public LoginResponseDto login(LoginRequestDto request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();

            if (user.getProviderType() == AuthProviderType.EMAIL
                    && !user.isVerified()) {

                log.warn("Login blocked: email not verified for {}", user.getUsername());
                throw new BadCredentialsException(
                        "Please verify your email before logging in"
                );
            }

            log.info("User logged in successfully: {}", user.getUsername());

            String accessToken = jwtService.createAccessToken(user);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

            return new LoginResponseDto(user.getId(), accessToken, refreshToken.getRefreshToken());

        } catch (BadCredentialsException e) {
            log.warn("Failed login attempt for username: {}", request.getUsername());
            throw new BadCredentialsException("Invalid username or password", e);
        }
    }

    @Transactional
    public LoginResponseDto refreshToken(String refreshTokenValue) {
        RefreshToken token = refreshTokenService.verifyRefreshToken(refreshTokenValue);
        User user = token.getUser();

        if (user == null) {
            log.error("User not found for valid refresh token");
            throw new IllegalStateException("User not found");
        }

        evictAuthState(refreshTokenValue);
        String newAccessToken = jwtService.createAccessToken(user);
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);

        log.info("Refresh token rotated for user: {}", user.getUsername());

        return new LoginResponseDto(
                user.getId(),
                newAccessToken,
                newRefreshToken.getRefreshToken()
        );
    }

    @Transactional
    public User signupInternal(SignupRequestDto request, AuthProviderType authProviderType, String providerId) {
        validateSignupRequest(request, authProviderType);

        User existing = userRepository.findByUsername(request.getUsername()).orElse(null);
        if (existing != null) {
            log.warn("Signup attempt with existing username: {}", request.getUsername());
            throw new IllegalArgumentException("Username already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .username(request.getUsername())
                .providerId(providerId)
                .providerType(authProviderType)
                .isVerified(authProviderType != AuthProviderType.EMAIL)
                .roles(new HashSet<>(Set.of(RoleType.USER)))
                .build();

        if (authProviderType == AuthProviderType.EMAIL) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User savedUser = userRepository.save(user);
        log.info("New user registered: {} via {}", request.getUsername(), authProviderType);
        return savedUser;
    }

    /**
     * Public signup endpoint for email-based registration.
     *
     * @param request Signup request
     * @return SignupResponseDto with user ID and username
     */
    @Transactional
    public SignupResponseDto signup(SignupRequestDto request) {
        User user = signupInternal(request, AuthProviderType.EMAIL, null);
        return new SignupResponseDto(user.getId(), user.getUsername());
    }

    public void logout(User user, String refreshToken) {
        if (user == null) return;

        if (refreshToken != null) {
            evictAuthState(refreshToken);
        }

        refreshTokenService.deleteRefreshTokenByUser(user);
    }

    @Transactional
    public LoginResponseDto handleOAuth2LoginRequest(OAuth2User oAuth2User, String registrationId) {
        AuthProviderType providerType = authUtil.getProviderTypeFromRegistrationId(registrationId);
        String providerId = authUtil.determineProviderIdFromOAuth2User(oAuth2User, registrationId);
        String email = oAuth2User.getAttribute("email");

        // Try to find existing user by provider credentials
        User user = userRepository.findByProviderIdAndProviderType(providerId, providerType).orElse(null);

        if (user == null) {
            // User doesn't exist, check if email is already registered with different provider
            User existingByEmail = userRepository.findByUsername(email).orElse(null);

            if (existingByEmail != null) {
                log.warn("OAuth2 email conflict: {} already registered with {}",
                        email, existingByEmail.getProviderType());
                throw new BadCredentialsException(
                        "Email already registered with " + existingByEmail.getProviderType()
                );
            }

            // Create new user
            user = createNewOAuth2User(oAuth2User, registrationId, providerType, providerId);
            log.info("New OAuth2 user created: {}", user.getUsername());

        } else {
            // Existing user, update email if changed
            updateOAuth2UserEmail(user, email);
            log.info("OAuth2 returning user logged in: {}", user.getUsername());
        }

        // Generate tokens
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        return new LoginResponseDto(
                user.getId(),
                jwtService.createAccessToken(user),
                refreshToken.getRefreshToken()
        );
    }

    private User createNewOAuth2User(OAuth2User oAuth2User, String registrationId,
                                     AuthProviderType providerType, String providerId) {
        String username = authUtil.determineUsernameFromOAuth2User(oAuth2User, registrationId, providerId);
        String name = authUtil.determineNameFromOAuth2User(oAuth2User, registrationId);

        return signupInternal(
                new SignupRequestDto(name, username, null),
                providerType,
                providerId
        );
    }

    private void updateOAuth2UserEmail(User user, String email) {
        if (email != null && !email.isBlank() && !email.equals(user.getUsername())) {
            user.setUsername(email);
            userRepository.save(user);
            log.debug("Updated email for user: {}", user.getId());
        }
    }

    private void validateSignupRequest(SignupRequestDto request, AuthProviderType authProviderType) {
        if (request == null || request.getUsername() == null || request.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }

        if (authProviderType == AuthProviderType.EMAIL) {
            if (request.getPassword() == null || request.getPassword().isBlank()) {
                throw new IllegalArgumentException("Password required for email signup");
            }
        }
    }
}