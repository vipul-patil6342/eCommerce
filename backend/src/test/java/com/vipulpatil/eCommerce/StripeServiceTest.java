package com.vipulpatil.eCommerce;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.vipulpatil.eCommerce.dto.PaymentResponseDto;
import com.vipulpatil.eCommerce.entity.Order;
import com.vipulpatil.eCommerce.entity.OrderItem;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.entity.type.OrderStatus;
import com.vipulpatil.eCommerce.service.StripeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;

@ExtendWith(MockitoExtension.class)
class StripeServiceTest {

    @InjectMocks
    private StripeService stripeService;

    private Session mockSession;
    private Order order;

    @BeforeEach
    void setUp() {

        // inject frontendUrl
        ReflectionTestUtils.setField(
                stripeService,
                "frontendUrl",
                "http://localhost:5173"
        );

        // mock Stripe session
        mockSession = mock(Session.class);
        org.mockito.Mockito.when(mockSession.getUrl())
                .thenReturn("https://checkout.stripe.com/pay/session_123");
        org.mockito.Mockito.when(mockSession.getId())
                .thenReturn("cs_test_123");

        // create order
        order = new Order();
        order.setOrderId(123L);
        order.setStatus(OrderStatus.CREATED);
        order.setTotalAmount(BigDecimal.valueOf(52000L));
        order.setCreatedAt(LocalDateTime.now());

        // attach user (optional but realistic)
        User user = new User();
        user.setId(1L);
        order.setUser(user);

        // order items
        OrderItem item1 = new OrderItem();
        item1.setOrder(order);
        item1.setProductId(1L);
        item1.setProductName("Laptop");
        item1.setPrice(BigDecimal.valueOf(50000L));
        item1.setQuantity(1);

        OrderItem item2 = new OrderItem();
        item2.setOrder(order);
        item2.setProductId(2L);
        item2.setProductName("Mouse");
        item2.setPrice(BigDecimal.valueOf(1000L));
        item2.setQuantity(2);

        order.setItems(List.of(item1, item2));
    }

    @Test
    void shouldCreateCheckoutSession_successfully() {

        try (MockedStatic<Session> sessionMock = mockStatic(Session.class)) {

            sessionMock.when(() ->
                    Session.create(any(SessionCreateParams.class))
            ).thenReturn(mockSession);

            PaymentResponseDto response =
                    stripeService.createCheckoutSession(order);

            assertNotNull(response);
            assertEquals(
                    "https://checkout.stripe.com/pay/session_123",
                    response.getCheckoutUrl()
            );
            assertEquals("cs_test_123", response.getSessionId());
            assertEquals("CREATED", response.getStatus());
        }
    }
}
