package com.librarydesk.dto;

public class ReservationResponse {
    private String id;
    private Long databaseId;
    private String reservationCode;
    private String bookId;
    private Long bookDatabaseId;
    private String bookTitle;
    private String memberId;
    private Long memberDatabaseId;
    private String memberName;
    private String requestedDate;
    private Integer position;
    private String status;

    public ReservationResponse() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getDatabaseId() {
        return databaseId;
    }

    public void setDatabaseId(Long databaseId) {
        this.databaseId = databaseId;
    }

    public String getReservationCode() {
        return reservationCode;
    }

    public void setReservationCode(String reservationCode) {
        this.reservationCode = reservationCode;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public Long getBookDatabaseId() {
        return bookDatabaseId;
    }

    public void setBookDatabaseId(Long bookDatabaseId) {
        this.bookDatabaseId = bookDatabaseId;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public Long getMemberDatabaseId() {
        return memberDatabaseId;
    }

    public void setMemberDatabaseId(Long memberDatabaseId) {
        this.memberDatabaseId = memberDatabaseId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public String getRequestedDate() {
        return requestedDate;
    }

    public void setRequestedDate(String requestedDate) {
        this.requestedDate = requestedDate;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
