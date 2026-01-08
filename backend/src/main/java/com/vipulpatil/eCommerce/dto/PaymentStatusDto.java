package com.vipulpatil.eCommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusDto {
    private String orderId;
    private String paymentIntentId;
    private String status;
}
