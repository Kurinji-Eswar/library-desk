package com.librarydesk.dto;

import java.time.OffsetDateTime;

public class RecentActivityResponse {
    private String id;
    private String type;
    private String text;
    private OffsetDateTime at;

    public RecentActivityResponse() {}

    public RecentActivityResponse(String id, String type, String text, OffsetDateTime at) {
        this.id = id;
        this.type = type;
        this.text = text;
        this.at = at;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public OffsetDateTime getAt() {
        return at;
    }

    public void setAt(OffsetDateTime at) {
        this.at = at;
    }
}
