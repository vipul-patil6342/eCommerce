package com.vipulpatil.eCommerce.service;

public interface EmailService {

    void sendSimpleEmail(String to, String subject, String body);
}
