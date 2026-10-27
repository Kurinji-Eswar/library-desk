package com.librarydesk.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class LoanStatusConverter implements AttributeConverter<LoanStatus, String> {

    @Override
    public String convertToDatabaseColumn(LoanStatus attribute) {
        if (attribute == null) return null;
        return attribute == LoanStatus.DUE_TODAY ? "DUE_TODAY" : attribute.name();
    }

    @Override
    public LoanStatus convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return LoanStatus.ACTIVE;
        }
        String normalized = dbData.trim().replace(" ", "_").toUpperCase();
        try {
            return LoanStatus.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            return LoanStatus.ACTIVE;
        }
    }
}
