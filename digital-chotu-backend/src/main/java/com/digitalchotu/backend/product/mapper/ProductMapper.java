package com.digitalchotu.backend.product.mapper;

import com.digitalchotu.backend.brand.entity.Brand;
import com.digitalchotu.backend.category.entity.Category;
import com.digitalchotu.backend.product.dto.BrandSummaryDto;
import com.digitalchotu.backend.product.dto.CategorySummaryDto;
import com.digitalchotu.backend.product.dto.ProductRequestDto;
import com.digitalchotu.backend.product.dto.ProductResponseDto;
import com.digitalchotu.backend.product.dto.ProductVariantRequestDto;
import com.digitalchotu.backend.product.dto.ProductVariantResponseDto;
import com.digitalchotu.backend.product.entity.Product;
import com.digitalchotu.backend.product.entity.ProductVariant;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductMapper {

    public Product toEntity(ProductRequestDto request, Category category, Brand brand) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .category(category)
                .brand(brand)
                .build();

        request.getVariants().forEach(variantRequest ->
                product.addVariant(toVariantEntity(variantRequest))
        );

        return product;
    }

    public ProductResponseDto toResponseDto(Product product) {
        return ProductResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .category(toCategorySummary(product.getCategory()))
                .brand(toBrandSummary(product.getBrand()))
                .variants(toVariantResponseList(product.getVariants()))
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public List<ProductResponseDto> toResponseDtoList(List<Product> products) {
        return products.stream()
                .map(this::toResponseDto)
                .toList();
    }

    public void updateEntity(Product product, ProductRequestDto request, Category category, Brand brand) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);
        product.setBrand(brand);
        replaceVariants(product, request.getVariants());
    }

    private void replaceVariants(Product product, List<ProductVariantRequestDto> variantRequests) {
        product.clearVariants();
        variantRequests.forEach(variantRequest ->
                product.addVariant(toVariantEntity(variantRequest))
        );
    }

    private ProductVariant toVariantEntity(ProductVariantRequestDto request) {
        return ProductVariant.builder()
                .variantName(request.getVariantName())
                .weight(request.getWeight())
                .unit(request.getUnit())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .build();
    }

    private List<ProductVariantResponseDto> toVariantResponseList(List<ProductVariant> variants) {
        return variants.stream()
                .map(this::toVariantResponse)
                .toList();
    }

    private ProductVariantResponseDto toVariantResponse(ProductVariant variant) {
        return ProductVariantResponseDto.builder()
                .id(variant.getId())
                .variantName(variant.getVariantName())
                .weight(variant.getWeight())
                .unit(variant.getUnit())
                .price(variant.getPrice())
                .stockQuantity(variant.getStockQuantity())
                .build();
    }

    private CategorySummaryDto toCategorySummary(Category category) {
        return CategorySummaryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }

    private BrandSummaryDto toBrandSummary(Brand brand) {
        return BrandSummaryDto.builder()
                .id(brand.getId())
                .name(brand.getName())
                .build();
    }
}
