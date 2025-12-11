package com.vipulpatil.eCommerce.service;

import com.vipulpatil.eCommerce.dto.ProductRequestDto;
import com.vipulpatil.eCommerce.dto.ProductResponseDto;
import com.vipulpatil.eCommerce.entity.Product;
import com.vipulpatil.eCommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    public ProductResponseDto addProduct(ProductRequestDto request){
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .stock(request.getStock())
                .build();

        productRepository.save(product);

        return modelMapper.map(product, ProductResponseDto.class);
    }

    public ProductResponseDto updateProduct(Long id, ProductRequestDto request){
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setStock(request.getStock());

        productRepository.save(product);

        return modelMapper.map(product, ProductResponseDto.class);
    }

    public void deleteProduct(Long id){
        productRepository.deleteById(id);
    }

    public List<ProductResponseDto> getAllProducts(){
        return productRepository.findAll()
                .stream()
                .map(product -> modelMapper.map(product, ProductResponseDto.class))
                .toList();
    }

    public ProductResponseDto getProductById(Long id){
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        return modelMapper.map(product, ProductResponseDto.class);
    }


}
