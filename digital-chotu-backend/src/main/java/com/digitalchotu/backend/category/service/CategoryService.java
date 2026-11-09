package com.digitalchotu.backend.category.service;

import com.digitalchotu.backend.category.dto.CategoryRequestDto;
import com.digitalchotu.backend.category.dto.CategoryResponseDto;
import com.digitalchotu.backend.category.entity.Category;
import com.digitalchotu.backend.category.repository.CategoryRepository;
import com.digitalchotu.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public CategoryResponseDto getCategoryById(UUID id) {
        Category category = findCategoryById(id);
        return toResponseDto(category);
    }

    @Transactional
    public CategoryResponseDto createCategory(CategoryRequestDto request) {
        Category category = Category.builder()
                .name(request.getName())
                .build();

        Category savedCategory = categoryRepository.save(category);
        return toResponseDto(savedCategory);
    }

    @Transactional
    public CategoryResponseDto updateCategory(UUID id, CategoryRequestDto request) {
        Category category = findCategoryById(id);
        category.setName(request.getName());

        return toResponseDto(category);
    }

    @Transactional
    public void deleteCategory(UUID id) {
        Category category = findCategoryById(id);
        categoryRepository.delete(category);
    }

    private Category findCategoryById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private CategoryResponseDto toResponseDto(Category category) {
        return CategoryResponseDto.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }
}
