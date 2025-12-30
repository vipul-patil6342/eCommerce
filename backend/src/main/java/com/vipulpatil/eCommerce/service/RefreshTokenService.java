package com.vipulpatil.eCommerce.service;

import com.vipulpatil.eCommerce.entity.RefreshToken;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.error.BadRequestException;
import com.vipulpatil.eCommerce.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refreshTokenExpiration:604800000}")
    private long refreshTokenExpiration;

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        if (user == null || user.getId() == null) {
            throw new BadRequestException("User cannot be null");
        }

        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElse(RefreshToken.builder()
                        .user(user)
                        .build());

        refreshToken.setRefreshToken(UUID.randomUUID().toString());
        refreshToken.setExpiry(Instant.now().plusMillis(refreshTokenExpiration));

        RefreshToken saved = refreshTokenRepository.save(refreshToken);
        log.debug("Refresh token created for user: {}", user.getId());
        return saved;
    }

    @Transactional
    public RefreshToken verifyRefreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new BadRequestException("Refresh token cannot be null or empty");
        }

        RefreshToken token = refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> {
                    log.warn("Invalid refresh token attempt");
                    return new BadRequestException("Invalid refresh token");
                });

        if (token.getExpiry().isBefore(Instant.now())) {
            log.warn("Refresh token expired for user: {}", token.getUser().getId());
            deleteRefreshToken(token);
            throw new BadRequestException("Refresh token expired");
        }

        return token;
    }

    @Transactional
    public void deleteRefreshToken(RefreshToken refreshToken) {
        refreshTokenRepository.delete(refreshToken);
        log.debug("Refresh token deleted");
    }

    @Transactional
    public void deleteRefreshTokenByUser(User user) {
        if (user == null || user.getId() == null) {
            throw new BadRequestException("User cannot be null");
        }

        refreshTokenRepository.deleteByUser(user);
        log.info("All refresh tokens deleted for user: {}", user.getId());
    }
}