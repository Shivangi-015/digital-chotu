package com.digitalchotu.backend.chat.dto;

import com.digitalchotu.backend.product.dto.ProductResponseDto;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ChatResponse {

    private String reply;
    private List<ProductResponseDto> products;
}
