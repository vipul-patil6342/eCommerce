package com.vipulpatil.eCommerce;

import com.vipulpatil.eCommerce.dto.ProductRequestDto;
import com.vipulpatil.eCommerce.dto.ProductResponseDto;
import com.vipulpatil.eCommerce.entity.Product;
import com.vipulpatil.eCommerce.repository.ProductRepository;
import com.vipulpatil.eCommerce.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void shouldCreateProduct() throws IOException {
        ProductRequestDto product = new ProductRequestDto();
        product.setName("Laptop");
        product.setCategory("Electronics");
        product.setBrand("HP");
        product.setStock(100);
        product.setDescription("good product");
        product.setPrice(BigDecimal.valueOf(50000));

        ClassPathResource imageFile = new ClassPathResource("images/test.jpeg");

        MockMultipartFile image = new MockMultipartFile(
                "image",
                "test.jpeg",
                MediaType.IMAGE_JPEG_VALUE,
                imageFile.getInputStream()
        );


        ProductResponseDto saved = productService.addProduct(product,image);

        assertNotNull(saved.getId());
        assertEquals("Laptop",saved.getName());
        assertNotNull(saved.getImageUrl());
        assertFalse(saved.getImageUrl().isBlank());
    }

    @Test
    void shouldGetProductById() {
        Product product = new Product();
        product.setName("Laptop");
        product.setCategory("Electronics");
        product.setBrand("HP");
        product.setStock(100);
        product.setDescription("good product");
        product.setPrice(BigDecimal.valueOf(50000));
        product.setImageUrl("http://test-image-url.com/laptop.jpg");

        Product saved = productRepository.save(product);

        ProductResponseDto found = productService.getProductById(saved.getId());

        assertNotNull(found);
        assertEquals(saved.getId(), found.getId());
        assertEquals("Laptop", found.getName());

        assertNotNull(found.getImageUrl());
        assertFalse(found.getImageUrl().isBlank());
        assertTrue(found.getImageUrl().contains("laptop"));
    }

    @Test
    void shouldDeleteProduct() throws IOException {
        Product product = new Product();
        product.setName("Laptop");
        product.setCategory("Electronics");
        product.setBrand("HP");
        product.setStock(100);
        product.setDescription("good product");
        product.setPrice(BigDecimal.valueOf(50000));
        product.setImageUrl("http://test-image-url.com/laptop.jpg");

        Product saved = productRepository.save(product);

        productService.deleteProduct(saved.getId());

        assertFalse(productRepository.existsById(saved.getId()));
    }

    @Test
    void shouldUpdateProductWithImage() throws IOException {

        Product existing = new Product();
        existing.setName("Laptop");
        existing.setCategory("Electronics");
        existing.setBrand("HP");
        existing.setStock(100);
        existing.setDescription("good product");
        existing.setPrice(BigDecimal.valueOf(50000));
        existing.setImageUrl("old-image.jpg");

        Product saved = productRepository.save(existing);

        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Laptop Pro");
        dto.setCategory("Electronics");
        dto.setBrand("HP");
        dto.setStock(50);
        dto.setDescription("updated product");
        dto.setPrice(BigDecimal.valueOf(70000));

        ClassPathResource imageFile = new ClassPathResource("images/test.jpeg");

        MockMultipartFile newImage = new MockMultipartFile(
                "image",
                "test.jpeg",
                MediaType.IMAGE_JPEG_VALUE,
                imageFile.getInputStream()
        );

        ProductResponseDto updated =
                productService.updateProduct(saved.getId(), dto, newImage);

        assertEquals("Laptop Pro", updated.getName());
        assertNotNull(updated.getImageUrl());
    }

    @Test
    void shouldSearchProduct(){
        Product p1 = new Product();
        p1.setName("Laptop");
        p1.setCategory("Electronics");
        p1.setBrand("HP");
        p1.setStock(100);
        p1.setDescription("good product");
        p1.setPrice(BigDecimal.valueOf(50000));
        p1.setImageUrl("old-image.jpg");

        Product p3 = new Product();
        p3.setName("Phone");
        p3.setCategory("Electronics");
        p3.setBrand("Oppo");
        p3.setStock(100);
        p3.setDescription("good product");
        p3.setPrice(BigDecimal.valueOf(20000));

        Product p2 = new Product();
        p2.setName("Phone");
        p2.setCategory("Electronics");
        p2.setBrand("Vivo");
        p2.setStock(130);
        p2.setDescription("nice product");
        p2.setPrice(BigDecimal.valueOf(25000));
        p2.setImageUrl("vivo-image.jpg");

        productRepository.saveAll(List.of(p1,p2,p3));

        Pageable pageable = PageRequest.of(0,12, Sort.by(Sort.Direction.ASC , "price"));

        Page<ProductResponseDto> results1 = productService.searchProducts("phone",pageable);
        assertNotNull(results1);
        assertEquals(2,results1.getTotalElements());

        Page<ProductResponseDto> results2 = productService.searchProducts("Vivo",pageable);
        assertNotNull(results2);
        assertEquals(1,results2.getTotalElements());

        Page<ProductResponseDto> results3 = productService.searchProducts("Camera",pageable);
        assertNotNull(results3);
        assertTrue(results3.isEmpty());
    }

    @Test
    void shouldGetProductsByCategory(){
        Product p1 = new Product();
        p1.setName("Laptop");
        p1.setCategory("Electronics");
        p1.setBrand("HP");
        p1.setStock(100);
        p1.setDescription("good product");
        p1.setPrice(BigDecimal.valueOf(50000));
        p1.setImageUrl("old-image.jpg");

        Product p3 = new Product();
        p3.setName("T-Shirt");
        p3.setCategory("Clothing");
        p3.setBrand("NewCloths");
        p3.setStock(100);
        p3.setDescription("Very good product");
        p3.setPrice(BigDecimal.valueOf(2000));

        Product p2 = new Product();
        p2.setName("Phone");
        p2.setCategory("Electronics");
        p2.setBrand("Vivo");
        p2.setStock(130);
        p2.setDescription("nice product");
        p2.setPrice(BigDecimal.valueOf(25000));
        p2.setImageUrl("vivo-image.jpg");

        productRepository.saveAll(List.of(p1,p2,p3));

        Pageable pageable = PageRequest.of(0,12,Sort.by(Sort.Direction.ASC,"price"));

        Page<ProductResponseDto> results2 = productService.getProductsByCategory("Clothing",pageable);
        assertEquals(1,results2.getTotalElements());

        Page<ProductResponseDto> results3 = productService.getProductsByCategory("Accessories",pageable);
        assertTrue(results3.isEmpty());
    }
}
