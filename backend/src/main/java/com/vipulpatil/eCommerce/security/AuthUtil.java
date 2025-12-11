package com.vipulpatil.eCommerce.security;

import com.vipulpatil.eCommerce.entity.type.AuthProviderType;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    public AuthProviderType getProviderTypeFromRegistrationId(String registrationId){
        return switch(registrationId.toLowerCase()){
            case "google" -> AuthProviderType.GOOGLE;
            case "github" -> AuthProviderType.GITHUB;
            default -> throw new IllegalArgumentException("Unsupported OAuth2 Provider: " + registrationId);
        };
    }

    public String determineProviderIdFromOAuth2User(OAuth2User oAuth2User, String registrationId){
        String providerId = switch (registrationId.toLowerCase()){
            case "google" -> oAuth2User.getAttribute("sub");
            case "github" -> oAuth2User.getAttribute("id").toString();
            default -> throw new IllegalArgumentException("Unsupported OAuth2 Provider: " + registrationId);
        };

        if(providerId == null || providerId.isBlank()){
            throw new IllegalArgumentException("Unable to determine providerId for OAuth2 login");
        }

        return providerId;
    }

    public String determineUsernameFromOAuth2User(OAuth2User oAuth2User, String registrationId, String providerId){
        String email = oAuth2User.getAttribute("email");
        if(email != null && !email.isBlank()){
            return email;
        }

        return switch (registrationId.toLowerCase()){
            case "google" -> oAuth2User.getAttribute("sub");
            case "github" -> oAuth2User.getAttribute("login");
            default -> providerId;
        };
    }

    public String determineNameFromOAuth2User(OAuth2User oAuth2User, String registrationId){
        return switch (registrationId.toLowerCase()){
            case "google" -> oAuth2User.getAttribute("name");
            case "github" -> {
                String name = oAuth2User.getAttribute("name");
                if(name != null && !name.isBlank()){
                    yield name;
                }

                yield oAuth2User.getAttribute("login");
            }
            default -> {
                String name = oAuth2User.getAttribute("name");
                yield (name != null && !name.isBlank()) ? name: "OAuth2 User";
            }
        };
    }
}
