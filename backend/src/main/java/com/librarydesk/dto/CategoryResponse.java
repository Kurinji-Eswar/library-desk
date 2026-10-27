package com.librarydesk.dto;

public class CategoryResponse {
    private String id;
    private Long databaseId;
    private String code;
    private String name;
    private String description;
    private long bookCount;

    public CategoryResponse() {}

    public CategoryResponse(String id, Long databaseId, String code, String name, String description, long bookCount) {
        this.id = id;
        this.databaseId = databaseId;
        this.code = code;
        this.name = name;
        this.description = description;
        this.bookCount = bookCount;
    }

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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getBookCount() {
        return bookCount;
    }

    public void setBookCount(long bookCount) {
        this.bookCount = bookCount;
    }
}
