package com.librarydesk.controller;

import com.librarydesk.dto.ApiResponse;
import com.librarydesk.dto.LoanRequest;
import com.librarydesk.dto.LoanResponse;
import com.librarydesk.dto.ReturnRequest;
import com.librarydesk.service.LoanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@Tag(name = "Circulation & Loans", description = "Endpoints for issuing loans, processing returns, tracking overdues, and fines")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping
    @Operation(summary = "List all circulation loans", description = "Retrieves active, due today, overdue, and returned loans")
    public ResponseEntity<ApiResponse<List<LoanResponse>>> getAllLoans(
            @RequestParam(value = "status", required = false) String status) {
        List<LoanResponse> loans = loanService.getAllLoans(status);
        return ResponseEntity.ok(ApiResponse.ok(loans));
    }

    @GetMapping("/overdue")
    @Operation(summary = "List overdue loans")
    public ResponseEntity<ApiResponse<List<LoanResponse>>> getOverdueLoans() {
        List<LoanResponse> overdue = loanService.getOverdueLoans();
        return ResponseEntity.ok(ApiResponse.ok(overdue));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get loan by ID or Loan Code")
    public ResponseEntity<ApiResponse<LoanResponse>> getLoan(@PathVariable("id") String id) {
        LoanResponse loan = loanService.getLoanByIdOrCode(id);
        return ResponseEntity.ok(ApiResponse.ok(loan));
    }

    @PostMapping
    @Operation(summary = "Issue a book loan")
    public ResponseEntity<ApiResponse<LoanResponse>> issueLoan(@Valid @RequestBody LoanRequest request) {
        LoanResponse created = loanService.issueLoan(request);
        return new ResponseEntity<>(ApiResponse.ok("Loan created successfully", created), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/return")
    @Operation(summary = "Process loan return and calculate/waive overdue fines")
    public ResponseEntity<ApiResponse<LoanResponse>> processReturn(
            @PathVariable("id") String id,
            @RequestBody(required = false) ReturnRequest request) {
        LoanResponse updated = loanService.processReturn(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Return processed successfully", updated));
    }
}
