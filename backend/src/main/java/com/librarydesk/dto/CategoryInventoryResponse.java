package com.librarydesk.dto;

public class CategoryInventoryResponse {
    private String category;
    private long titleCount;
    private long totalCopies;
    private long availableCopies;
    private long borrowedCopies;

    public CategoryInventoryResponse() {}

    public CategoryInventoryResponse(String category, long titleCount, long totalCopies, long availableCopies, long borrowedCopies) {
        this.category = category;
        this.titleCount = titleCount;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
        this.borrowedCopies = borrowedCopies;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public long getTitleCount() {
        return titleCount;
    }

    public void setTitleCount(long titleCount) {
        this.titleCount = titleCount;
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
}
