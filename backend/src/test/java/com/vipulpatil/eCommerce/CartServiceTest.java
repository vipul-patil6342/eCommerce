package com.vipulpatil.eCommerce;

import com.vipulpatil.eCommerce.dto.AddToCartRequestDto;
import com.vipulpatil.eCommerce.dto.CartDto;
import com.vipulpatil.eCommerce.entity.Cart;
import com.vipulpatil.eCommerce.entity.Product;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.repository.CartRepository;
import com.vipulpatil.eCommerce.repository.ProductRepository;
import com.vipulpatil.eCommerce.repository.UserRepository;
import com.vipulpatil.eCommerce.service.CartService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Transactional
public class CartServiceTest {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    private User createUser(){
        User u = new User();
        u.setName("test");
        u.setUsername("test@test.com");
        u.setPassword("pass");
        return u;
    }

    private Product createProduct(int stock){
        Product p = new Product();
        p.setName("Test Product");
        p.setCategory("testing");
        p.setPrice(BigDecimal.valueOf(100));
        p.setStock(stock);
        return p;
    }


    @Test
    void addToCart_shouldCreateCartAndItem(){
        User user = userRepository.save(createUser());
        Product product = productRepository.save(createProduct(10));

        AddToCartRequestDto request = new AddToCartRequestDto();
        request.setProductId(product.getId());
        request.setQuantity(2);

        cartService.addToCart(user , request);

        CartDto fetched = cartService.getCart(user);

        assertEquals(1,fetched.getItems().size());
        assertEquals(2,fetched.getItems().get(0).getQuantity());
    }

    @Test
    void clearCart_shouldRemoveAllItems() {
        // Arrange
        User user = userRepository.save(createUser());
        Product product = productRepository.save(createProduct(10));

        AddToCartRequestDto request = new AddToCartRequestDto();
        request.setProductId(product.getId());
        request.setQuantity(2);

        cartService.addToCart(user, request);

        // Act
        cartService.clearCart(user.getId());

        // Assert
        CartDto cart = cartService.getCart(user);
        assertEquals(0, cart.getItems().size());
    }



}
