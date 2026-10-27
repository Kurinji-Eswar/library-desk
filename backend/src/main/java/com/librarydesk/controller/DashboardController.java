package com.librarydesk.controller;

import com.librarydesk.dto.ApiResponse;
import com.librarydesk.dto.DashboardSummaryResponse;
import com.librarydesk.dto.RecentActivityResponse;
import com.librarydesk.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Endpoints for library workstation dashboard metrics and activity log")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get workstation dashboard summary metrics")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary() {
        DashboardSummaryResponse summary = dashboardService.getSummary();
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/recent-activity")
    @Operation(summary = "Get recent library event log")
    public ResponseEntity<ApiResponse<List<RecentActivityResponse>>> getRecentActivity() {
        List<RecentActivityResponse> activities = dashboardService.getRecentActivity();
        return ResponseEntity.ok(ApiResponse.ok(activities));
    }
}
