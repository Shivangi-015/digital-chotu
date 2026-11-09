package com.digitalchotu.backend.chat.service;

import com.digitalchotu.backend.chat.dto.ChatRequest;
import com.digitalchotu.backend.chat.dto.ChatResponse;
import com.digitalchotu.backend.product.dto.ProductResponseDto;
import com.digitalchotu.backend.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ProductService productService;

    public ChatResponse chat(ChatRequest request) {
        String message = request.getMessage();
        List<ProductResponseDto> products = productService.searchProducts(message);

        if (products.isEmpty()) {
            return ChatResponse.builder()
                    .reply("Sorry, mujhe ye product nahi mila.")
                    .products(List.of())
                    .build();
        }

        return ChatResponse.builder()
                .reply("Ji! Mujhe matching products mil gaye.")
                .products(products)
                .build();
    }
}
