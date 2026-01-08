package com.vipulpatil.eCommerce.service;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.vipulpatil.eCommerce.dto.PaymentResponseDto;
import com.vipulpatil.eCommerce.entity.Order;
import com.vipulpatil.eCommerce.entity.OrderItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class StripeService {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public PaymentResponseDto createCheckoutSession(Order order){

        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

        for(OrderItem item : order.getItems()){

            SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                    .setQuantity(item.getQuantity().longValue())
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("inr")
                                    .setUnitAmount(item.getPrice().multiply(BigDecimal.valueOf(100)).longValueExact())
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName(item.getProductName())
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            lineItems.add(lineItem);

        }
        log.info("Order ID before Stripe: {}", order.getOrderId());

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/payment-success?orderId=" + order.getOrderId())
                .setCancelUrl(frontendUrl + "/payment-cancel?orderId=" + order.getOrderId())
                .putMetadata("orderId",order.getOrderId().toString())
                .addAllLineItem(lineItems)
                .build();

        try{
            Session session = Session.create(params);

            return PaymentResponseDto.builder()
                    .checkoutUrl(session.getUrl())
                    .sessionId(session.getId())
                    .status("CREATED")
                    .build();
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }
    }
}