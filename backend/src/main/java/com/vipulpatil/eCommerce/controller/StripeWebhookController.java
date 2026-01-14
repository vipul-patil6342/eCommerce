package com.vipulpatil.eCommerce.controller;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.vipulpatil.eCommerce.entity.Order;
import com.vipulpatil.eCommerce.entity.type.OrderStatus;
import com.vipulpatil.eCommerce.error.BadRequestException;
import com.vipulpatil.eCommerce.repository.OrderRepository;
import com.vipulpatil.eCommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookController {

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    private final OrderRepository orderRepository;
    private final CartService cartService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) throws Exception {
        log.info("Webhook hit, sigHeader={}", sigHeader != null);

        log.info("Stripe webhook received");
        Event event;
        try{
            event = Webhook.constructEvent(
                    payload,sigHeader,webhookSecret
            );
        } catch (SignatureVerificationException e) {
            log.error("Invalid Stripe signature", e);
            return ResponseEntity.ok("Invalid signature ignored");
        }


        if("checkout.session.completed".equals(event.getType())){
            Session session = (Session) event.getDataObjectDeserializer().getObject().get();

            Long orderId = Long.valueOf(session.getMetadata().get("orderId"));

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            if(order.getStatus() == OrderStatus.PAID){
                return ResponseEntity.ok("order already processed");
            }

            order.setStatus(OrderStatus.PAID);
            order.setPaymentId(session.getPaymentIntent());

            orderRepository.save(order);

            cartService.clearCart(order.getUser().getId());
        }

        return ResponseEntity.ok("");
    }
}
