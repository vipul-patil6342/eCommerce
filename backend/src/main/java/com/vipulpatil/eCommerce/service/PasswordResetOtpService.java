package com.vipulpatil.eCommerce.service;

import com.vipulpatil.eCommerce.dto.EmailRequestDto;
import com.vipulpatil.eCommerce.dto.PasswordResetRequest;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.error.BadRequestException;
import com.vipulpatil.eCommerce.error.ResourceNotFoundException;
import com.vipulpatil.eCommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordResetOtpService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public void sendPasswordResetOtp(EmailRequestDto request) {

        userRepository.findByUsername(request.getEmail()).ifPresent(user -> {
            String otp = otpService.generateAndSaveOtp(request.getEmail());

            emailService.sendSimpleEmail(
                    request.getEmail(),
                    "Password Reset OTP",
                    "Your OTP is: " + otp + "\nValid for 5 minutes."
            );
        });
    }

    public void resetPassword(PasswordResetRequest request){
        boolean verified = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if(!verified){
            throw new BadRequestException("Invalid or Expired OTP");
        }

        User user = userRepository.findByUsername(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
