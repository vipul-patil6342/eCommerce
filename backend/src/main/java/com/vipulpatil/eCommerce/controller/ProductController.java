package com.vipulpatil.eCommerce.controller;

import com.vipulpatil.eCommerce.dto.ProductRequestDto;
import com.vipulpatil.eCommerce.dto.ProductResponseDto;
import com.vipulpatil.eCommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
@Slf4j
public class ProductController {

    private final ProductService productService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ProductResponseDto> addProduct(
            @Valid @RequestPart("product") ProductRequestDto request,
            @RequestPart("image") MultipartFile file
    ) throws IOException {
        log.info("Product: {}", request);
        log.info("Image content type: {}", file.getContentType());

        ProductResponseDto response = productService.addProduct(request, file);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestPart("product") ProductRequestDto request,
            @RequestPart(value = "image", required = false) MultipartFile file
    ) throws IOException {
        ProductResponseDto response = productService.updateProduct(id, request, file);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) throws IOException {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product Deleted Successfully");
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping
    public ResponseEntity<Page<ProductResponseDto>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "price") String sortBy,
            @RequestParam(defaultValue = "ASC") Sort.Direction direction
    ) {
        Pageable pageable = PageRequest.of(page, 12, Sort.by(direction, sortBy));
        Page<ProductResponseDto> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
        ProductResponseDto response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponseDto>> searchProducts(@RequestParam String q, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "ASC") Sort.Direction direction) {
        Pageable pageable = PageRequest.of(page, 12, Sort.by(direction, sortBy));
        return ResponseEntity.ok(productService.searchProducts(q, pageable));
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<ProductResponseDto>> getProductsByCategory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "price") String sortBy,
            @RequestParam(defaultValue = "ASC") Sort.Direction direction,
            @PathVariable String category
    ) {
        Pageable pageable = PageRequest.of(page, 12, Sort.by(direction, sortBy));
        Page<ProductResponseDto> response = productService.getProductsByCategory(category, pageable);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/low-stock")
    public ResponseEntity<Page<ProductResponseDto>> getStockAlerts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "20") int threshold
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "stock"));
        Page<ProductResponseDto> response = productService.getStockAlerts(threshold, pageable);
        return ResponseEntity.ok(response);
    }
}
