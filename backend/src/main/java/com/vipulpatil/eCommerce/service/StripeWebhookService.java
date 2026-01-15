package com.vipulpatil.eCommerce.service;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.vipulpatil.eCommerce.entity.Order;
import com.vipulpatil.eCommerce.entity.OrderItem;
import com.vipulpatil.eCommerce.entity.Product;
import com.vipulpatil.eCommerce.entity.type.OrderStatus;
import com.vipulpatil.eCommerce.error.BadRequestException;
import com.vipulpatil.eCommerce.error.ResourceNotFoundException;
import com.vipulpatil.eCommerce.repository.OrderRepository;
import com.vipulpatil.eCommerce.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookService {
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    private final CartService cartService;

    public void processWebhook(String payload, String sigHeader){
        Event event;

        try {
            event = Webhook.constructEvent(payload,sigHeader,webhookSecret);
        } catch (SignatureVerificationException e) {
            throw new BadRequestException("Invalid stripe signature");
        }

        log.info("Stripe event received: {}", event.getType());

        switch(event.getType()){
            case "checkout.session.completed" -> handleCheckoutCompleted(event);

            case "checkout.session.expired",
                 "payment_intent.payment_failed" -> handlePaymentFailed(event);

            default -> log.info("Unhandled stripe event type");
        }
    }

    private void handlePaymentFailed(Event event) {
        String orderId = extractOrderId(event);

        Order order = orderRepository.findById(Long.valueOf(orderId))
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(OrderStatus.FAILED);
        orderRepository.save(order);

    }

    @Transactional
    private void handleCheckoutCompleted(Event event) {
        Session session = (Session) event
                .getDataObjectDeserializer()
                .getObject()
                .orElseThrow(() -> new BadRequestException("Invalid session"));

        Long orderId = Long.valueOf(session.getMetadata().get("orderId"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == OrderStatus.PAID) {
            log.info("Order {} already PAID", orderId);
            return;
        }

        for(OrderItem item : order.getItems()){
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            if(product.getStock() < item.getQuantity()){
                throw new BadRequestException("Insufficient stock");
            }

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.PAID);
        order.setPaymentId(session.getPaymentIntent());
        orderRepository.save(order);

        cartService.clearCart(order.getUser().getId());
    }

    private String extractOrderId(Event event){
        Session session = (Session) event
                .getDataObjectDeserializer()
                .getObject()
                .orElseThrow();

        return session.getMetadata().get("orderId");

    }
}
