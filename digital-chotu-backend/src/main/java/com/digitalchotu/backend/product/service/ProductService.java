package com.digitalchotu.backend.product.service;

import com.digitalchotu.backend.brand.entity.Brand;
import com.digitalchotu.backend.brand.repository.BrandRepository;
import com.digitalchotu.backend.category.entity.Category;
import com.digitalchotu.backend.category.repository.CategoryRepository;
import com.digitalchotu.backend.exception.ResourceNotFoundException;
import com.digitalchotu.backend.product.dto.ProductRequestDto;
import com.digitalchotu.backend.product.dto.ProductResponseDto;
import com.digitalchotu.backend.product.entity.Product;
import com.digitalchotu.backend.product.exception.ProductNotFoundException;
import com.digitalchotu.backend.product.mapper.ProductMapper;
import com.digitalchotu.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductMapper productMapper;

    public List<ProductResponseDto> getAllProducts() {
        return productMapper.toResponseDtoList(productRepository.findAllWithDetails());
    }

    public ProductResponseDto getProductById(UUID id) {
        Product product = productRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        return productMapper.toResponseDto(product);
    }

    public List<ProductResponseDto> searchProducts(String keyword) {
        return productMapper.toResponseDtoList(productRepository.searchByKeyword(keyword));
    }

    @Transactional
    public ProductResponseDto createProduct(ProductRequestDto request) {
        Category category = findCategory(request.getCategoryId());
        Brand brand = findBrand(request.getBrandId());

        Product product = productMapper.toEntity(request, category, brand);
        Product savedProduct = productRepository.save(product);

        return productMapper.toResponseDto(
                productRepository.findByIdWithDetails(savedProduct.getId())
                        .orElseThrow(() -> new ProductNotFoundException(savedProduct.getId()))
        );
    }

    @Transactional
    public ProductResponseDto updateProduct(UUID id, ProductRequestDto request) {
        Product product = productRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        Category category = findCategory(request.getCategoryId());
        Brand brand = findBrand(request.getBrandId());

        productMapper.updateEntity(product, request, category, brand);

        return productMapper.toResponseDto(product);
    }

    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        productRepository.delete(product);
    }

    private Category findCategory(UUID categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }

    private Brand findBrand(UUID brandId) {
        return brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + brandId));
    }
}
