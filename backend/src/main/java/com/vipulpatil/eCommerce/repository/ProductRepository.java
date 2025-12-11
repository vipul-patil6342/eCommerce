package com.vipulpatil.eCommerce.repository;

import com.vipulpatil.eCommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}