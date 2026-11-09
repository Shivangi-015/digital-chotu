package com.digitalchotu.backend.brand.repository;

import com.digitalchotu.backend.brand.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BrandRepository extends JpaRepository<Brand, UUID> {
}
