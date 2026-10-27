package com.librarydesk.dto;

import jakarta.validation.constraints.NotBlank;

public class ReservationRequest {

    @NotBlank(message = "Book ID is required")
    private String bookId;

    @NotBlank(message = "Member ID is required")
    private String memberId;

    private String requestedDate;

    public ReservationRequest() {}

    public ReservationRequest(String bookId, String memberId, String requestedDate) {
        this.bookId = bookId;
        this.memberId = memberId;
        this.requestedDate = requestedDate;
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

    public String getRequestedDate() {
        return requestedDate;
    }

    public void setRequestedDate(String requestedDate) {
        this.requestedDate = requestedDate;
    }
}
