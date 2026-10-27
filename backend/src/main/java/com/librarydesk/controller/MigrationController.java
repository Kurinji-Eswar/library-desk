package com.librarydesk.controller;

import com.librarydesk.dto.*;
import com.librarydesk.service.BookService;
import com.librarydesk.service.CategoryService;
import com.librarydesk.service.LoanService;
import com.librarydesk.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/migration")
@Tag(name = "Data Migration", description = "Endpoints for migrating browser localStorage records to PostgreSQL database")
public class MigrationController {

    private final CategoryService categoryService;
    private final BookService bookService;
    private final MemberService memberService;
    private final LoanService loanService;

    public MigrationController(CategoryService categoryService,
                               BookService bookService,
                               MemberService memberService,
                               LoanService loanService) {
        this.categoryService = categoryService;
        this.bookService = bookService;
        this.memberService = memberService;
        this.loanService = loanService;
    }

    @PostMapping("/import")
    @Operation(summary = "Migrate browser localStorage records to relational database")
    public ResponseEntity<ApiResponse<Map<String, Object>>> importLocalStorageData(@RequestBody Map<String, Object> payload) {
        Map<String, Object> summary = new HashMap<>();
        List<String> logs = new ArrayList<>();
        int importedCategories = 0;
        int importedBooks = 0;
        int importedMembers = 0;
        int importedLoans = 0;

        // 1. Categories
        if (payload.containsKey("categories")) {
            List<Map<String, Object>> categories = (List<Map<String, Object>>) payload.get("categories");
            for (Map<String, Object> cat : categories) {
                String name = (String) cat.get("name");
                if (name != null && !name.trim().isEmpty()) {
                    try {
                        categoryService.createCategory(new CategoryRequest(name, (String) cat.get("description")));
                        importedCategories++;
                    } catch (Exception e) {
                        logs.add("Category '" + name + "' skipped: " + e.getMessage());
                    }
                }
            }
        }

        // 2. Members
        if (payload.containsKey("members")) {
            List<Map<String, Object>> members = (List<Map<String, Object>>) payload.get("members");
            for (Map<String, Object> m : members) {
                try {
                    MemberRequest req = new MemberRequest();
                    req.setName((String) m.get("name"));
                    req.setEmail((String) m.get("email"));
                    req.setPhone((String) m.get("phone"));
                    req.setAddress((String) m.get("address"));
                    req.setMembershipType((String) m.get("membershipType"));
                    req.setStatus((String) m.get("status"));
                    memberService.createMember(req);
                    importedMembers++;
                } catch (Exception e) {
                    logs.add("Member '" + m.get("email") + "' skipped: " + e.getMessage());
                }
            }
        }

        // 3. Books
        if (payload.containsKey("books")) {
            List<Map<String, Object>> books = (List<Map<String, Object>>) payload.get("books");
            for (Map<String, Object> b : books) {
                try {
                    BookRequest req = new BookRequest();
                    req.setTitle((String) b.get("title"));
                    req.setAuthor((String) b.get("author"));
                    req.setIsbn((String) b.get("isbn"));
                    req.setCategory((String) b.get("category"));
                    req.setPublisher((String) b.get("publisher"));
                    Number year = (Number) b.get("year");
                    req.setYear(year != null ? year.intValue() : 2020);
                    Number total = (Number) b.get("totalCopies");
                    req.setTotalCopies(total != null ? total.intValue() : 1);
                    req.setShelf((String) b.get("shelf"));
                    req.setDescription((String) b.get("description"));
                    bookService.createBook(req);
                    importedBooks++;
                } catch (Exception e) {
                    logs.add("Book '" + b.get("title") + "' skipped: " + e.getMessage());
                }
            }
        }

        // 4. Loans
        if (payload.containsKey("loans")) {
            List<Map<String, Object>> loans = (List<Map<String, Object>>) payload.get("loans");
            for (Map<String, Object> l : loans) {
                try {
                    LoanRequest req = new LoanRequest();
                    req.setBookId((String) l.get("bookId"));
                    req.setMemberId((String) l.get("memberId"));
                    req.setBorrowedDate((String) l.get("borrowedDate"));
                    req.setDueDate((String) l.get("dueDate"));
                    loanService.issueLoan(req);
                    importedLoans++;
                } catch (Exception e) {
                    logs.add("Loan skipped: " + e.getMessage());
                }
            }
        }

        summary.put("importedCategories", importedCategories);
        summary.put("importedBooks", importedBooks);
        summary.put("importedMembers", importedMembers);
        summary.put("importedLoans", importedLoans);
        summary.put("logs", logs);

        return ResponseEntity.ok(ApiResponse.ok("Data migration completed successfully", summary));
    }
}
