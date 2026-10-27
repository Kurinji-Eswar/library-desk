package com.librarydesk.service;

import com.librarydesk.dto.BookRequest;
import com.librarydesk.dto.BookResponse;
import com.librarydesk.exception.BusinessRuleException;
import com.librarydesk.exception.DuplicateResourceException;
import com.librarydesk.exception.ResourceNotFoundException;
import com.librarydesk.model.Book;
import com.librarydesk.model.Category;
import com.librarydesk.model.LoanStatus;
import com.librarydesk.model.ReservationStatus;
import com.librarydesk.repository.BookRepository;
import com.librarydesk.repository.CategoryRepository;
import com.librarydesk.repository.LoanRepository;
import com.librarydesk.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final LoanRepository loanRepository;
    private final ReservationRepository reservationRepository;

    public BookService(BookRepository bookRepository,
                       CategoryRepository categoryRepository,
                       LoanRepository loanRepository,
                       ReservationRepository reservationRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.loanRepository = loanRepository;
        this.reservationRepository = reservationRepository;
    }

    @Transactional(readOnly = true)
    public List<BookResponse> getAllBooks(String query, String category) {
        String trimmedQuery = (query != null && !query.trim().isEmpty()) ? query.trim().toLowerCase() : null;
        String trimmedCat = (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) ? category.trim() : null;

        List<Book> books;
        if (trimmedCat != null) {
            books = bookRepository.findByCategory_NameIgnoreCaseOrderByIdDesc(trimmedCat);
        } else {
            books = bookRepository.findAllByOrderByIdDesc();
        }

        if (trimmedQuery != null) {
            books = books.stream()
                    .filter(b -> b.getTitle().toLowerCase().contains(trimmedQuery) ||
                                 b.getAuthor().toLowerCase().contains(trimmedQuery) ||
                                 b.getIsbn().toLowerCase().contains(trimmedQuery))
                    .collect(Collectors.toList());
        }

        return books.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookResponse getBookByIdOrCode(String identifier) {
        Book book = resolveBook(identifier);
        return toResponse(book);
    }

    public BookResponse createBook(BookRequest request) {
        String cleanIsbn = request.getIsbn().trim();
        if (bookRepository.existsByIsbn(cleanIsbn)) {
            throw new DuplicateResourceException("A book with ISBN '" + cleanIsbn + "' already exists in catalog.");
        }

        Category category = resolveCategoryByNameOrId(request.getCategory());

        Book book = new Book();
        book.setCode("BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        book.setIsbn(cleanIsbn);
        book.setTitle(request.getTitle().trim());
        book.setAuthor(request.getAuthor().trim());
        book.setPublisher(request.getPublisher());
        book.setPublicationYear(request.getYear());
        book.setCategory(category);
        book.setTotalCopies(request.getTotalCopies());
        book.setAvailableCopies(request.getTotalCopies());
        book.setShelfLocation(request.getShelf() != null ? request.getShelf().trim() : "A1");
        book.setDescription(request.getDescription());

        Book saved = bookRepository.save(book);
        return toResponse(saved);
    }

    public BookResponse updateBook(String identifier, BookRequest request) {
        Book book = resolveBook(identifier);
        String cleanIsbn = request.getIsbn().trim();

        if (!book.getIsbn().equalsIgnoreCase(cleanIsbn) && bookRepository.existsByIsbn(cleanIsbn)) {
            throw new DuplicateResourceException("Another book already exists with ISBN: " + cleanIsbn);
        }

        Category category = resolveCategoryByNameOrId(request.getCategory());

        int borrowedCopies = book.getTotalCopies() - book.getAvailableCopies();
        int newTotal = request.getTotalCopies();
        if (newTotal < borrowedCopies) {
            throw new BusinessRuleException("Cannot reduce total copies to " + newTotal + " because " + borrowedCopies + " copies are currently on loan.");
        }

        book.setIsbn(cleanIsbn);
        book.setTitle(request.getTitle().trim());
        book.setAuthor(request.getAuthor().trim());
        book.setPublisher(request.getPublisher());
        book.setPublicationYear(request.getYear());
        book.setCategory(category);
        book.setTotalCopies(newTotal);
        book.setAvailableCopies(newTotal - borrowedCopies);
        if (request.getShelf() != null) {
            book.setShelfLocation(request.getShelf().trim());
        }
        book.setDescription(request.getDescription());

        Book updated = bookRepository.save(book);
        return toResponse(updated);
    }

    public void deleteBook(String identifier) {
        Book book = resolveBook(identifier);

        var activeLoans = loanRepository.findByBookIdAndStatusNot(book.getId(), LoanStatus.RETURNED);
        if (!activeLoans.isEmpty()) {
            throw new BusinessRuleException("Cannot delete book '" + book.getTitle() + "' because it has " + activeLoans.size() + " active or overdue loan(s). All copies must be returned first.");
        }

        var activeReservations = reservationRepository.findByBookIdAndStatusIn(book.getId(), List.of(ReservationStatus.WAITING, ReservationStatus.READY));
        if (!activeReservations.isEmpty()) {
            throw new BusinessRuleException("Cannot delete book '" + book.getTitle() + "' because it has " + activeReservations.size() + " active hold/reservation(s).");
        }

        bookRepository.delete(book);
    }

    public Book resolveBook(String identifier) {
        try {
            Long id = Long.parseLong(identifier);
            return bookRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + identifier));
        } catch (NumberFormatException e) {
            return bookRepository.findByCode(identifier)
                    .or(() -> bookRepository.findByIsbn(identifier))
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found with identifier: " + identifier));
        }
    }

    private Category resolveCategoryByNameOrId(String catIdentifier) {
        try {
            Long id = Long.parseLong(catIdentifier);
            return categoryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + catIdentifier));
        } catch (NumberFormatException e) {
            return categoryRepository.findByNameIgnoreCase(catIdentifier)
                    .or(() -> categoryRepository.findByCode(catIdentifier))
                    .orElseGet(() -> {
                        String code = "CAT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                        return categoryRepository.save(new Category(code, catIdentifier.trim().toUpperCase(), "Custom Category"));
                    });
        }
    }

    public BookResponse toResponse(Book book) {
        BookResponse resp = new BookResponse();
        resp.setId(book.getCode());
        resp.setDatabaseId(book.getId());
        resp.setCode(book.getCode());
        resp.setIsbn(book.getIsbn());
        resp.setTitle(book.getTitle());
        resp.setAuthor(book.getAuthor());
        resp.setPublisher(book.getPublisher());
        resp.setYear(book.getPublicationYear());
        resp.setCategory(book.getCategory().getName());
        resp.setCategoryId(book.getCategory().getId());
        resp.setTotalCopies(book.getTotalCopies());
        resp.setAvailableCopies(book.getAvailableCopies());
        resp.setShelf(book.getShelfLocation());
        resp.setDescription(book.getDescription());
        if (book.getCreatedAt() != null) {
            resp.setAddedDate(book.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE));
        }
        return resp;
    }
}
