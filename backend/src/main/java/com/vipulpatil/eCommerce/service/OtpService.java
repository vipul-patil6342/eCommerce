package com.vipulpatil.eCommerce.service;

import com.vipulpatil.eCommerce.repository.UserRepository;
import com.vipulpatil.eCommerce.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final StringRedisTemplate template;
    private final OtpUtil otpUtil;
    private final UserRepository userRepository;

    private static final long OTP_EXPIRY_MINUTES = 5;

    public String generateAndSaveOtp(String email){
        String otp = otpUtil.generateOtp();
        storeOtpInRedis(email,otp);
        return otp;
    }

    private void storeOtpInRedis(String email, String otp) {
        template.opsForValue().set(
                "otp:" + email ,
                otp,
                OTP_EXPIRY_MINUTES,
                TimeUnit.MINUTES
        );
    }

    public boolean verifyOtp(String email , String otp){
        String storedOtp = template.opsForValue().get("otp:" + email);

        if(storedOtp == null){
            return false;
        }

        if(storedOtp.equals(otp)){
            template.delete("otp:" + email);
            return true;
        }

        return false;
    }

    public boolean verifyOtpAndMarkEmailVerified(String email, String otp){
        boolean isValid = verifyOtp(email, otp);

        if(!isValid) return false;

        userRepository.findByUsername(email).ifPresent(user -> {
            user.setVerified(true);
            userRepository.save(user);
        });

        return true;
    }
}
