package com.digitalchotu.backend.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponseDto {

    private UUID id;
    private String variantName;
    private BigDecimal weight;
    private String unit;
    private BigDecimal price;
    private Integer stockQuantity;
}
