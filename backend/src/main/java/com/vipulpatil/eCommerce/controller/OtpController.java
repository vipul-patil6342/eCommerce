package com.vipulpatil.eCommerce.controller;

import com.vipulpatil.eCommerce.dto.OtpRequestDto;
import com.vipulpatil.eCommerce.dto.OtpVerifyRequestDto;
import com.vipulpatil.eCommerce.service.EmailService;
import com.vipulpatil.eCommerce.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;
    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendOtp(@Valid  @RequestBody OtpRequestDto request){
        try{
            String otp = otpService.generateAndSaveOtp(request.getEmail());

            emailService.sendSimpleEmail(
                    request.getEmail(),
                    "Your OTP Code",
                    "Your OTP is " + otp + ". Valid for 5 minutes"
            );

            return ResponseEntity.ok("OTP sent successfully to " + request.getEmail());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send OTP : " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(@Valid @RequestBody OtpVerifyRequestDto request){
            boolean isValid = otpService.verifyOtpAndMarkEmailVerified(request.getEmail(), request.getOtp());

            if(isValid){
                return ResponseEntity.ok("OTP verified successfully");
            }else{
                return ResponseEntity.status(400).body("Invalid or Expired OTP");
            }
    }
}
