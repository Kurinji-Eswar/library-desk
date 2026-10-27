package com.librarydesk.dto;

import java.math.BigDecimal;

public class DashboardSummaryResponse {
    private long totalBooks;
    private long available;
    private long borrowed;
    private long overdue;
    private long dueToday;
    private long activeLoans;
    private long totalMembers;
    private long totalCategories;
    private BigDecimal totalFines;

    public DashboardSummaryResponse() {}

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getAvailable() {
        return available;
    }

    public void setAvailable(long available) {
        this.available = available;
    }

    public long getBorrowed() {
        return borrowed;
    }

    public void setBorrowed(long borrowed) {
        this.borrowed = borrowed;
    }

    public long getOverdue() {
        return overdue;
    }

    public void setOverdue(long overdue) {
        this.overdue = overdue;
    }

    public long getDueToday() {
        return dueToday;
    }

    public void setDueToday(long dueToday) {
        this.dueToday = dueToday;
    }

    public long getActiveLoans() {
        return activeLoans;
    }

    public void setActiveLoans(long activeLoans) {
        this.activeLoans = activeLoans;
    }

    public long getTotalMembers() {
        return totalMembers;
    }

    public void setTotalMembers(long totalMembers) {
        this.totalMembers = totalMembers;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public BigDecimal getTotalFines() {
        return totalFines;
    }

    public void setTotalFines(BigDecimal totalFines) {
        this.totalFines = totalFines;
    }
}
