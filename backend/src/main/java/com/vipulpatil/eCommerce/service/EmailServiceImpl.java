package com.vipulpatil.eCommerce.service;

import com.vipulpatil.eCommerce.error.BadRequestException;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    @Value("${smtp.from-email}")
    private String fromEmail;

    @Value("${brevo.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    @Async
    public void sendSimpleEmail(String to, String subject, String body) {

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key",apiKey);

            String payload = """
            {
              "sender": { "email": "%s", "name": "Bazaar" },
              "to": [{ "email": "%s" }],
              "subject": "%s",
              "htmlContent": "%s"
            }
            """.formatted(fromEmail, to, subject, body.replace("\n", "<br>"));

            HttpEntity<String> request = new HttpEntity<>(payload,headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.brevo.com/v3/smtp/email",
                    request,
                    String.class
            );

            if(!response.getStatusCode().is2xxSuccessful()){
                throw new RuntimeException("Email API failed: " + response.getBody());
            }
        } catch (Exception ex) {
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
