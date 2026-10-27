package com.librarydesk.controller;

import com.librarydesk.dto.*;
import com.librarydesk.service.LoanService;
import com.librarydesk.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports & Analytics", description = "Endpoints for library analytics, inventory breakdown, and circulation reports")
public class ReportController {

    private final ReportService reportService;
    private final LoanService loanService;

    public ReportController(ReportService reportService, LoanService loanService) {
        this.reportService = reportService;
        this.loanService = loanService;
    }

    @GetMapping("/overview")
    @Operation(summary = "Get comprehensive library overview report")
    public ResponseEntity<ApiResponse<OverviewReportResponse>> getOverviewReport() {
        OverviewReportResponse report = reportService.getOverviewReport();
        return ResponseEntity.ok(ApiResponse.ok(report));
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get overdue loans with computed fine totals")
    public ResponseEntity<ApiResponse<List<LoanResponse>>> getOverdueReport() {
        List<LoanResponse> overdue = loanService.getOverdueLoans();
        return ResponseEntity.ok(ApiResponse.ok(overdue));
    }

    @GetMapping("/inventory-by-category")
    @Operation(summary = "Get book inventory aggregate breakdown grouped by category")
    public ResponseEntity<ApiResponse<List<CategoryInventoryResponse>>> getInventoryByCategory() {
        List<CategoryInventoryResponse> breakdown = reportService.getInventoryByCategory();
        return ResponseEntity.ok(ApiResponse.ok(breakdown));
    }

    @GetMapping("/popular-books")
    @Operation(summary = "Get most frequently borrowed books")
    public ResponseEntity<ApiResponse<List<PopularBookResponse>>> getPopularBooks() {
        List<PopularBookResponse> popular = reportService.getPopularBooks();
        return ResponseEntity.ok(ApiResponse.ok(popular));
    }

    @GetMapping("/member-loan-history/{memberId}")
    @Operation(summary = "Get complete circulation loan history for a specific patron/member")
    public ResponseEntity<ApiResponse<MemberLoanHistoryResponse>> getMemberLoanHistory(
            @PathVariable("memberId") String memberId) {
        MemberLoanHistoryResponse history = reportService.getMemberLoanHistory(memberId);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }
}
