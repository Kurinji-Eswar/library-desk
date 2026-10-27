package com.librarydesk.controller;

import com.librarydesk.dto.ApiResponse;
import com.librarydesk.dto.BookRequest;
import com.librarydesk.dto.BookResponse;
import com.librarydesk.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@Tag(name = "Books", description = "Endpoints for book cataloging, search, filtering, and copy management")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    @Operation(summary = "Search and list books", description = "Filters books by title, author, ISBN query and category")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getAllBooks(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "category", required = false) String category) {
        List<BookResponse> books = bookService.getAllBooks(query, category);
        return ResponseEntity.ok(ApiResponse.ok(books));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get book by ID, Code, or ISBN")
    public ResponseEntity<ApiResponse<BookResponse>> getBook(@PathVariable("id") String id) {
        BookResponse book = bookService.getBookByIdOrCode(id);
        return ResponseEntity.ok(ApiResponse.ok(book));
    }

    @PostMapping
    @Operation(summary = "Add book to catalog")
    public ResponseEntity<ApiResponse<BookResponse>> createBook(@Valid @RequestBody BookRequest request) {
        BookResponse created = bookService.createBook(request);
        return new ResponseEntity<>(ApiResponse.ok("Book added successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update book details")
    public ResponseEntity<ApiResponse<BookResponse>> updateBook(
            @PathVariable("id") String id,
            @Valid @RequestBody BookRequest request) {
        BookResponse updated = bookService.updateBook(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Book updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete book (guarded by active loans & reservations)")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable("id") String id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(ApiResponse.ok("Book deleted successfully", null));
    }
}
