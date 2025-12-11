package com.vipulpatil.eCommerce.security.service;

import com.vipulpatil.eCommerce.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
@Slf4j
public class JwtService {

    @Value("${jwt.secretKey}")
    private String jwtSecretKey;

    @Value("${jwt.accessTokenExpiration:600000}")
    private long accessTokenExpiration;

    private SecretKey secretKey;

    public SecretKey getSecretKey() {
        if (secretKey == null) {
            secretKey = Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
        }
        return secretKey;
    }

    public String createAccessToken(User user) {
        if (user == null || user.getUsername() == null) {
            throw new IllegalArgumentException("User and username cannot be null");
        }

        Date issuedAt = new Date(System.currentTimeMillis());
        Date expiresAt = new Date(System.currentTimeMillis() + accessTokenExpiration);

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("roles", user.getRoles())
                .issuedAt(issuedAt)
                .expiration(expiresAt)
                .signWith(getSecretKey())
                .compact();
    }

    public String extractUsername(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject();

        } catch (ExpiredJwtException e) {
            log.warn("JWT token expired");
            throw e;
        } catch (UnsupportedJwtException e) {
            log.warn("JWT token is unsupported");
            throw e;
        } catch (MalformedJwtException e) {
            log.warn("Invalid JWT token");
            throw e;
        } catch (SignatureException e) {
            log.warn("JWT signature validation failed");
            throw e;
        } catch (JwtException e) {
            log.warn("JWT parsing failed");
            throw e;
        }
    }

    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null || cookies.length == 0) {
            log.debug("No cookies found in request");
            return null;
        }

        for (Cookie cookie : cookies) {
            if ("accessToken".equals(cookie.getName())) {
                log.debug("Access token retrieved from cookie");
                return cookie.getValue();
            }
        }

        log.debug("Access token cookie not found");
        return null;
    }

    public String getValue(HttpServletRequest request){
        if (request.getCookies() == null) return null;

        for (var cookie : request.getCookies()) {
            if (cookie.getName().equals("refreshToken")) {
                return cookie.getValue();
            }
        }
        return null;
    }
}