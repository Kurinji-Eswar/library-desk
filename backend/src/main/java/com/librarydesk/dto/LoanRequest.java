package com.librarydesk.dto;

import jakarta.validation.constraints.NotBlank;

public class LoanRequest {

    @NotBlank(message = "Book ID is required")
    private String bookId;

    @NotBlank(message = "Member ID is required")
    private String memberId;

    private String borrowedDate;
    private String dueDate;

    public LoanRequest() {}

    public LoanRequest(String bookId, String memberId, String borrowedDate, String dueDate) {
        this.bookId = bookId;
        this.memberId = memberId;
        this.borrowedDate = borrowedDate;
        this.dueDate = dueDate;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public String getBorrowedDate() {
        return borrowedDate;
    }

    public void setBorrowedDate(String borrowedDate) {
        this.borrowedDate = borrowedDate;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }
}
