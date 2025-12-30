package com.vipulpatil.eCommerce;

import com.vipulpatil.eCommerce.utils.OtpUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class EmailTestService {

        @Autowired
        private JavaMailSender mailSender;

        @Autowired
        private OtpUtil otpUtil;

        @Test
        public void sendEmail(){
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("patilvipul1911@gmail.com");
            message.setTo("buddytalk08@gmail.com");
            message.setSubject("your email verify otp");
            message.setText(STR."Your OTP is \{otpUtil.generateOtp()}");

            mailSender.send(message);
        }
}
