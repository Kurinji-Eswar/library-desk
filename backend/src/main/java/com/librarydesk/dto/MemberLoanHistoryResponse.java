package com.librarydesk.dto;

import java.util.List;

public class MemberLoanHistoryResponse {
    private String memberId;
    private String memberName;
    private String memberEmail;
    private String membershipType;
    private String status;
    private long totalLoansCount;
    private long activeLoansCount;
    private List<LoanResponse> history;

    public MemberLoanHistoryResponse() {}

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public String getMemberEmail() {
        return memberEmail;
    }

    public void setMemberEmail(String memberEmail) {
        this.memberEmail = memberEmail;
    }

    public String getMembershipType() {
        return membershipType;
    }

    public void setMembershipType(String membershipType) {
        this.membershipType = membershipType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getTotalLoansCount() {
        return totalLoansCount;
    }

    public void setTotalLoansCount(long totalLoansCount) {
        this.totalLoansCount = totalLoansCount;
    }

    public long getActiveLoansCount() {
        return activeLoansCount;
    }

    public void setActiveLoansCount(long activeLoansCount) {
        this.activeLoansCount = activeLoansCount;
    }

    public List<LoanResponse> getHistory() {
        return history;
    }

    public void setHistory(List<LoanResponse> history) {
        this.history = history;
    }
}
