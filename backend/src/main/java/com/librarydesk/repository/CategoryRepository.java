package com.librarydesk.repository;

import com.librarydesk.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByNameIgnoreCase(String name);
    Optional<Category> findByCode(String code);
    boolean existsByNameIgnoreCase(String name);
    boolean existsByCode(String code);
}
