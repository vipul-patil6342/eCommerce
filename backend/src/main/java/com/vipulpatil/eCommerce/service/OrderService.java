package com.vipulpatil.eCommerce.service;

import com.vipulpatil.eCommerce.dto.CartDto;
import com.vipulpatil.eCommerce.dto.OrderItemDto;
import com.vipulpatil.eCommerce.dto.OrderResponseDto;
import com.vipulpatil.eCommerce.entity.*;
import com.vipulpatil.eCommerce.entity.type.OrderStatus;
import com.vipulpatil.eCommerce.error.BadRequestException;
import com.vipulpatil.eCommerce.error.ResourceNotFoundException;
import com.vipulpatil.eCommerce.repository.AddressRepository;
import com.vipulpatil.eCommerce.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final CartService cartService;
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;

    public Order createOrder(User user, Long addressId) {

        CartDto cart = cartService.getCart(user);

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Address address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new BadRequestException("Address not found"));

        OrderAddress orderAddress = new OrderAddress(
                address.getPhone(),
                address.getPincode(),
                address.getCountry(),
                address.getState(),
                address.getCity(),
                address.getStreet(),
                address.getHouse()
        );

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.CREATED);
        order.setTotalAmount(cart.getTotalPrice());
        order.setCreatedAt(LocalDateTime.now());
        order.setShippingAddress(orderAddress);

        order.setItems(
                cart.getItems().stream()
                        .map(item -> {
                            OrderItem orderItem = new OrderItem();
                            orderItem.setOrder(order);
                            orderItem.setProductId(item.getProductId());
                            orderItem.setPrice(item.getPrice());
                            orderItem.setQuantity(item.getQuantity());
                            orderItem.setProductName(item.getProductName());

                            return orderItem;
                        }).collect(Collectors.toList())
        );

        return orderRepository.save(order);
    }

    public Page<OrderResponseDto> getMyOrders(User user, Pageable pageable) {
        Page<Order> orderPage = orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(
                user.getId(),
                OrderStatus.PAID,
                pageable
        );

        return orderPage.map(this::mapToDto);
    }

    public Page<OrderResponseDto> getAllOrders(Pageable pageable){
        Page<Order> orderPage = orderRepository.findAll(pageable);
        return orderPage.map(this::mapToDto);
    }

    public OrderResponseDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return null;
        }
        return mapToDto(order);
    }

    private OrderResponseDto mapToDto(Order order) {
        return OrderResponseDto.builder()
                .id(order.getOrderId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .paymentId(order.getPaymentId())
                .createdAt(order.getCreatedAt())
                .items(
                        order.getItems().stream()
                                .map(item -> OrderItemDto.builder()
                                        .productId(item.getProductId())
                                        .productName(item.getProductName())
                                        .price(item.getPrice())
                                        .quantity(item.getQuantity())
                                        .build())
                                .collect(Collectors.toList())
                )
                .build();
    }
}
