package com.digitalchotu.backend.product.exception;

import com.digitalchotu.backend.exception.ResourceNotFoundException;

import java.util.UUID;

public class ProductNotFoundException extends ResourceNotFoundException {

    public ProductNotFoundException(UUID id) {
        super("Product not found with id: " + id);
    }
}
