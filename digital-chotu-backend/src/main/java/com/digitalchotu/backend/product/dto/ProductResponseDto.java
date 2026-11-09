package com.digitalchotu.backend.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDto {

    private UUID id;
    private String name;
    private String description;
    private String imageUrl;
    private CategorySummaryDto category;
    private BrandSummaryDto brand;
    private List<ProductVariantResponseDto> variants;
    private Instant createdAt;
    private Instant updatedAt;
}
