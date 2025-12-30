package com.vipulpatil.eCommerce.service;

import com.vipulpatil.eCommerce.error.BadRequestException;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
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

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to.trim());
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
        } catch (MatchException ex) {
            throw new RuntimeException("Failed to send email. Please try again later.");
        }
    }

    private void validatedEmailInput(String to, String subject, String body) {

        if (to == null || to.isBlank()) {
            throw new BadRequestException("Recipient email cannot be null or blank");
        }

        if(!isValidEmail(to)){
            throw new BadRequestException("Invalid email format");
        }

        if(subject == null || subject.isBlank()){
            throw new BadRequestException("Email subject cannot be empty");
        }

        if(body == null || body.isBlank()){
            throw new BadRequestException("Email body cannot be empty");
        }

        if(fromEmail == null || fromEmail.isBlank()){
            throw new IllegalArgumentException("SMTP fromEmail is not configured");
        }
    }

    private boolean isValidEmail(String email) {
        try{
            InternetAddress address = new InternetAddress(email);
            address.validate();
            return true;
        } catch (AddressException e) {
            return false;
        }
    }

}
