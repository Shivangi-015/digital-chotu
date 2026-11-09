package com.digitalchotu.backend.brand.service;

import com.digitalchotu.backend.brand.dto.BrandRequestDto;
import com.digitalchotu.backend.brand.dto.BrandResponseDto;
import com.digitalchotu.backend.brand.entity.Brand;
import com.digitalchotu.backend.brand.repository.BrandRepository;
import com.digitalchotu.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BrandService {

    private final BrandRepository brandRepository;

    public List<BrandResponseDto> getAllBrands() {
        return brandRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public BrandResponseDto getBrandById(UUID id) {
        Brand brand = findBrandById(id);
        return toResponseDto(brand);
    }

    @Transactional
    public BrandResponseDto createBrand(BrandRequestDto request) {
        Brand brand = Brand.builder()
                .name(request.getName())
                .build();

        Brand savedBrand = brandRepository.save(brand);
        return toResponseDto(savedBrand);
    }

    @Transactional
    public BrandResponseDto updateBrand(UUID id, BrandRequestDto request) {
        Brand brand = findBrandById(id);
        brand.setName(request.getName());

        return toResponseDto(brand);
    }

    @Transactional
    public void deleteBrand(UUID id) {
        Brand brand = findBrandById(id);
        brandRepository.delete(brand);
    }

    private Brand findBrandById(UUID id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
    }

    private BrandResponseDto toResponseDto(Brand brand) {
        return BrandResponseDto.builder()
                .id(brand.getId())
                .name(brand.getName())
                .build();
    }
}
