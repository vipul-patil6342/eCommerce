package com.vipulpatil.eCommerce.service;

import com.vipulpatil.eCommerce.dto.ProductRequestDto;
import com.vipulpatil.eCommerce.dto.ProductResponseDto;
import com.vipulpatil.eCommerce.entity.Product;
import com.vipulpatil.eCommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final CloudinaryService cloudinaryService;

    public ProductResponseDto addProduct(ProductRequestDto request, MultipartFile file) throws IOException {

        String imageUrl = null;
        String publicId = null;

        if (file != null && !file.isEmpty()) {
            var uploadResult = cloudinaryService.uploadImage(file);
            imageUrl = uploadResult.get("secure_url").toString();
            publicId = uploadResult.get("public_id").toString();
        }

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .brand(request.getBrand())
                .category(request.getCategory())
                .imageUrl(imageUrl)
                .publicId(publicId)
                .stock(request.getStock())
                .build();

        productRepository.save(product);

        return modelMapper.map(product, ProductResponseDto.class);
    }

    public ProductResponseDto updateProduct(Long id, ProductRequestDto request, MultipartFile file) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setStock(request.getStock());

        if (file != null && !file.isEmpty()) {
            if (product.getPublicId() != null) {
                cloudinaryService.deleteImage(product.getPublicId());
            }

            Map<String, Object> uploadResult = cloudinaryService.uploadImage(file);

            product.setImageUrl(uploadResult.get("secure_url").toString());
            product.setPublicId(uploadResult.get("public_id").toString());
        }

        productRepository.save(product);

        return modelMapper.map(product, ProductResponseDto.class);
    }

    public void deleteProduct(Long id) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getPublicId() != null && !product.getPublicId().isBlank()) {
            cloudinaryService.deleteImage(product.getPublicId());
        }
        productRepository.deleteById(id);
    }

    public Page<ProductResponseDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(product -> modelMapper.map(product, ProductResponseDto.class));
    }

    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        return modelMapper.map(product, ProductResponseDto.class);
    }


    public @Nullable Page<ProductResponseDto> searchProducts(String q, Pageable pageable) {
        return productRepository.search(q.toLowerCase(), pageable);
    }

    public Page<ProductResponseDto> getProductsByCategory(String category, Pageable pageable) {
        return productRepository.findByCategory(category, pageable);
    }
}
