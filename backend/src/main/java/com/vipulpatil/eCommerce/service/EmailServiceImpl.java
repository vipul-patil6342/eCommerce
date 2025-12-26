package com.vipulpatil.eCommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${smtp.from-email}")
    private String fromEmail;

    @Override
    @Async
    public void sendSimpleEmail(String to, String subject, String body) {

        if(to == null || to.isBlank()){
            throw new IllegalArgumentException("Recipient email cannot be null or blank");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to.trim());
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }


}
