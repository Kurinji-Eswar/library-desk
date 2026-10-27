package com.librarydesk.dto;

public class PopularBookResponse {
    private Long bookId;
    private String title;
    private String author;
    private String category;
    private long borrowCount;

    public PopularBookResponse() {}

    public PopularBookResponse(Long bookId, String title, String author, String category, long borrowCount) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.category = category;
        this.borrowCount = borrowCount;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public long getBorrowCount() {
        return borrowCount;
    }

    public void setBorrowCount(long borrowCount) {
        this.borrowCount = borrowCount;
    }
}
