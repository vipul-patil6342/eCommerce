package com.vipulpatil.eCommerce.service;

import com.vipulpatil.eCommerce.dto.AddToCartRequestDto;
import com.vipulpatil.eCommerce.dto.CartDto;
import com.vipulpatil.eCommerce.dto.CartItemDto;
import com.vipulpatil.eCommerce.entity.Cart;
import com.vipulpatil.eCommerce.entity.CartItem;
import com.vipulpatil.eCommerce.entity.Product;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.error.BadRequestException;
import com.vipulpatil.eCommerce.error.ResourceNotFoundException;
import com.vipulpatil.eCommerce.repository.CartItemRepository;
import com.vipulpatil.eCommerce.repository.CartRepository;
import com.vipulpatil.eCommerce.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setCreatedAt(LocalDateTime.now());
                    newCart.setUpdatedAt(LocalDateTime.now());
                    return cartRepository.save(newCart);
                });
    }

    public CartDto addToCart(User user, AddToCartRequestDto request) {

        if(request.getQuantity() <= 0){
            throw new BadRequestException("Quantity must be greater than 0");
        }

        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock available");
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            newItem.setPrice(product.getPrice());

            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);

        return convertToDto(cart);
    }

    public CartDto getCart(User user) {
        Cart cart = cartRepository.findByUserIdWithItems(user.getId())
                .orElseGet(() -> getOrCreateCart(user));
        return convertToDto(cart);
    }

    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        if (cart != null && !cart.getItems().isEmpty()) {
            cart.getItems().clear();
            cart.setUpdatedAt(LocalDateTime.now());
            cartRepository.save(cart);
        }
    }

    public CartDto removeFromCart(User user, Long productId) {
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in cart"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        return convertToDto(cart);
    }

    public CartDto updateQuantity(User user, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in cart"));

        if (quantity <= 0) {
            return removeFromCart(user, productId);
        }

        Product product = item.getProduct();

        if (product.getStock() < quantity) {
            throw new BadRequestException("Insufficient stock");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        return convertToDto(cart);
    }

    public Integer getCartItemsCount(User user) {
        Cart cart = getOrCreateCart(user);
        return cart.getItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    private CartDto convertToDto(Cart cart) {
        CartDto cartDto = new CartDto();
        cartDto.setCartId(cart.getId());

        cartDto.setItems(
                cart.getItems().stream()
                        .map(item -> new CartItemDto(
                                item.getProduct().getId(),
                                item.getProduct().getName(),
                                item.getQuantity(),
                                item.getPrice(),
                                item.getProduct().getImageUrl(),
                                item.getSubTotal()
                        )).collect(Collectors.toList())
        );

        cartDto.setTotalPrice(cart.getTotalPrice());
        cartDto.setItemCount(cart.getItemCount());

        return cartDto;
    }
}


