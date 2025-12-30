package com.vipulpatil.eCommerce.error;

public class BadRequestException extends RuntimeException{

    public BadRequestException(String message){
        super(message);
    }
}
