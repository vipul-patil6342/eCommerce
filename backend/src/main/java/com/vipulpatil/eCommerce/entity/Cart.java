package com.vipulpatil.eCommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    public BigDecimal getTotalPrice(){
        return items.stream()
                .map(CartItem::getSubTotal)
                .reduce(BigDecimal.ZERO , BigDecimal::add);
    }

    public Integer getItemCount(){
        return items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }
}
