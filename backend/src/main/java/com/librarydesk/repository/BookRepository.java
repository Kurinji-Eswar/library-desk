package com.librarydesk.repository;

import com.librarydesk.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
    Optional<Book> findByCode(String code);
    boolean existsByIsbn(String isbn);
    boolean existsByCode(String code);
    List<Book> findByCategoryId(Long categoryId);
    long countByCategoryId(Long categoryId);

    List<Book> findAllByOrderByIdDesc();
    List<Book> findByCategory_NameIgnoreCaseOrderByIdDesc(String categoryName);

    @Query("SELECT b.category.name, COUNT(b), SUM(b.totalCopies), SUM(b.availableCopies) " +
           "FROM Book b GROUP BY b.category.name ORDER BY b.category.name ASC")
    List<Object[]> getInventoryByCategory();
}
