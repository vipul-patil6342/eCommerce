package com.vipulpatil.eCommerce.controller;

import com.vipulpatil.eCommerce.dto.PaymentResponseDto;
import com.vipulpatil.eCommerce.entity.Order;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.service.OrderService;
import com.vipulpatil.eCommerce.service.StripeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final OrderService orderService;
    private final StripeService stripeService;

    @PostMapping("/checkout")
    public ResponseEntity<PaymentResponseDto> createCheckoutSession(
            @RequestParam Long addressId,
            @AuthenticationPrincipal User user
    ) {
        Order order = orderService.createOrder(user, addressId);
        return ResponseEntity.ok(stripeService.createCheckoutSession(order));
    }
}
