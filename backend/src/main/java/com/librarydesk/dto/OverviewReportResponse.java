package com.librarydesk.dto;

import java.math.BigDecimal;
import java.util.List;

public class OverviewReportResponse {
    private long totalTitles;
    private long totalCopies;
    private long availableCopies;
    private long borrowedCopies;
    private long totalMembers;
    private long activeMembers;
    private long blockedMembers;
    private long totalLoansCount;
    private long activeLoansCount;
    private long overdueLoansCount;
    private BigDecimal totalFinesCollected;
    private List<CategoryInventoryResponse> categoryBreakdown;
    private List<PopularBookResponse> topBooks;

    public OverviewReportResponse() {}

    public long getTotalTitles() {
        return totalTitles;
    }

    public void setTotalTitles(long totalTitles) {
        this.totalTitles = totalTitles;
    }

    public long getTotalCopies() {
        return totalCopies;
    }

    public void setTotalCopies(long totalCopies) {
        this.totalCopies = totalCopies;
    }

    public long getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(long availableCopies) {
        this.availableCopies = availableCopies;
    }

    public long getBorrowedCopies() {
        return borrowedCopies;
    }

    public void setBorrowedCopies(long borrowedCopies) {
        this.borrowedCopies = borrowedCopies;
    }

    public long getTotalMembers() {
        return totalMembers;
    }

    public void setTotalMembers(long totalMembers) {
        this.totalMembers = totalMembers;
    }

    public long getActiveMembers() {
        return activeMembers;
    }

    public void setActiveMembers(long activeMembers) {
        this.activeMembers = activeMembers;
    }

    public long getBlockedMembers() {
        return blockedMembers;
    }

    public void setBlockedMembers(long blockedMembers) {
        this.blockedMembers = blockedMembers;
    }

    public long getTotalLoansCount() {
        return totalLoansCount;
    }

    public void setTotalLoansCount(long totalLoansCount) {
        this.totalLoansCount = totalLoansCount;
    }

    public long getActiveLoansCount() {
        return activeLoansCount;
    }

    public void setActiveLoansCount(long activeLoansCount) {
        this.activeLoansCount = activeLoansCount;
    }

    public long getOverdueLoansCount() {
        return overdueLoansCount;
    }

    public void setOverdueLoansCount(long overdueLoansCount) {
        this.overdueLoansCount = overdueLoansCount;
    }

    public BigDecimal getTotalFinesCollected() {
        return totalFinesCollected;
    }

    public void setTotalFinesCollected(BigDecimal totalFinesCollected) {
        this.totalFinesCollected = totalFinesCollected;
    }

    public List<CategoryInventoryResponse> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategoryInventoryResponse> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<PopularBookResponse> getTopBooks() {
        return topBooks;
    }

    public void setTopBooks(List<PopularBookResponse> topBooks) {
        this.topBooks = topBooks;
    }
}
