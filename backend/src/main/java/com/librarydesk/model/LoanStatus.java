package com.librarydesk.model;

public enum LoanStatus {
    ACTIVE,
    DUE_TODAY,
    OVERDUE,
    RETURNED;

    public static LoanStatus fromString(String text) {
        if (text == null) return ACTIVE;
        String normalized = text.trim().replace(" ", "_").toUpperCase();
        try {
            return LoanStatus.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            return ACTIVE;
        }
    }

    public String toDisplayString() {
        return this == DUE_TODAY ? "DUE TODAY" : this.name();
    }
}
