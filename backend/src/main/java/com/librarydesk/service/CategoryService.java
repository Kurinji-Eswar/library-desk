package com.librarydesk.service;

import com.librarydesk.dto.CategoryRequest;
import com.librarydesk.dto.CategoryResponse;
import com.librarydesk.exception.BusinessRuleException;
import com.librarydesk.exception.DuplicateResourceException;
import com.librarydesk.exception.ResourceNotFoundException;
import com.librarydesk.model.Category;
import com.librarydesk.repository.BookRepository;
import com.librarydesk.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;

    public CategoryService(CategoryRepository categoryRepository, BookRepository bookRepository) {
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryByIdOrCode(String identifier) {
        Category category = resolveCategory(identifier);
        return toResponse(category);
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        String name = request.getName().trim().toUpperCase();
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateResourceException("Category '" + name + "' already exists.");
        }

        String code = "CAT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Category category = new Category(code, name, request.getDescription());
        Category saved = categoryRepository.save(category);
        return toResponse(saved);
    }

    public CategoryResponse updateCategory(String identifier, CategoryRequest request) {
        Category category = resolveCategory(identifier);
        String newName = request.getName().trim().toUpperCase();

        if (!category.getName().equalsIgnoreCase(newName) && categoryRepository.existsByNameIgnoreCase(newName)) {
            throw new DuplicateResourceException("Category '" + newName + "' already exists.");
        }

        category.setName(newName);
        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }

        Category updated = categoryRepository.save(category);
        return toResponse(updated);
    }

    public void deleteCategory(String identifier) {
        Category category = resolveCategory(identifier);
        long bookCount = bookRepository.countByCategoryId(category.getId());
        if (bookCount > 0) {
            throw new BusinessRuleException("Cannot delete category '" + category.getName() + "' because it is referenced by " + bookCount + " book(s). Please reassign books first.");
        }
        categoryRepository.delete(category);
    }

    public Category resolveCategory(String identifier) {
        try {
            Long id = Long.parseLong(identifier);
            return categoryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + identifier));
        } catch (NumberFormatException e) {
            return categoryRepository.findByCode(identifier)
                    .or(() -> categoryRepository.findByNameIgnoreCase(identifier))
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with identifier: " + identifier));
        }
    }

    public CategoryResponse toResponse(Category category) {
        long bookCount = bookRepository.countByCategoryId(category.getId());
        return new CategoryResponse(
                category.getCode(),
                category.getId(),
                category.getCode(),
                category.getName(),
                category.getDescription(),
                bookCount
        );
    }
}
