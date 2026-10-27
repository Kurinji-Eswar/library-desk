package com.librarydesk.dto;

public class ReturnRequest {
    private boolean waiveFine = false;
    private String returnDate;

    public ReturnRequest() {}

    public ReturnRequest(boolean waiveFine, String returnDate) {
        this.waiveFine = waiveFine;
        this.returnDate = returnDate;
    }

    public boolean isWaiveFine() {
        return waiveFine;
    }

    public void setWaiveFine(boolean waiveFine) {
        this.waiveFine = waiveFine;
    }

    public String getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(String returnDate) {
        this.returnDate = returnDate;
    }
}
