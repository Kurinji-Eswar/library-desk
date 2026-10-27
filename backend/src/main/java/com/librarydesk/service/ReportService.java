package com.librarydesk.service;

import com.librarydesk.dto.*;
import com.librarydesk.model.Book;
import com.librarydesk.model.Loan;
import com.librarydesk.model.Member;
import com.librarydesk.model.MemberStatus;
import com.librarydesk.repository.BookRepository;
import com.librarydesk.repository.CategoryRepository;
import com.librarydesk.repository.LoanRepository;
import com.librarydesk.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final CategoryRepository categoryRepository;
    private final LoanRepository loanRepository;
    private final MemberService memberService;
    private final LoanService loanService;

    public ReportService(BookRepository bookRepository,
                         MemberRepository memberRepository,
                         CategoryRepository categoryRepository,
                         LoanRepository loanRepository,
                         MemberService memberService,
                         LoanService loanService) {
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
        this.categoryRepository = categoryRepository;
        this.loanRepository = loanRepository;
        this.memberService = memberService;
        this.loanService = loanService;
    }

    public OverviewReportResponse getOverviewReport() {
        List<Book> books = bookRepository.findAll();
        long totalTitles = books.size();
        long totalCopies = books.stream().mapToLong(Book::getTotalCopies).sum();
        long availableCopies = books.stream().mapToLong(Book::getAvailableCopies).sum();
        long borrowedCopies = Math.max(0, totalCopies - availableCopies);

        long totalMembers = memberRepository.count();
        long activeMembers = memberRepository.findByStatus(MemberStatus.ACTIVE).size();
        long blockedMembers = memberRepository.findByStatus(MemberStatus.BLOCKED).size();

        long totalLoans = loanRepository.count();
        long activeLoans = loanRepository.countByStatusNot(com.librarydesk.model.LoanStatus.RETURNED);
        long overdueLoans = loanRepository.findByStatusNotAndDueDateBefore(com.librarydesk.model.LoanStatus.RETURNED, LocalDate.now()).size();
        BigDecimal totalFines = loanRepository.getTotalFinesCollected();

        OverviewReportResponse resp = new OverviewReportResponse();
        resp.setTotalTitles(totalTitles);
        resp.setTotalCopies(totalCopies);
        resp.setAvailableCopies(availableCopies);
        resp.setBorrowedCopies(borrowedCopies);
        resp.setTotalMembers(totalMembers);
        resp.setActiveMembers(activeMembers);
        resp.setBlockedMembers(blockedMembers);
        resp.setTotalLoansCount(totalLoans);
        resp.setActiveLoansCount(activeLoans);
        resp.setOverdueLoansCount(overdueLoans);
        resp.setTotalFinesCollected(totalFines != null ? totalFines : BigDecimal.ZERO);
        resp.setCategoryBreakdown(getInventoryByCategory());
        resp.setTopBooks(getPopularBooks());
        return resp;
    }

    public List<CategoryInventoryResponse> getInventoryByCategory() {
        List<Object[]> raw = bookRepository.getInventoryByCategory();
        List<CategoryInventoryResponse> list = new ArrayList<>();
        for (Object[] row : raw) {
            String catName = (String) row[0];
            long count = ((Number) row[1]).longValue();
            long total = ((Number) row[2]).longValue();
            long available = ((Number) row[3]).longValue();
            long borrowed = Math.max(0, total - available);
            list.add(new CategoryInventoryResponse(catName, count, total, available, borrowed));
        }
        return list;
    }

    public List<PopularBookResponse> getPopularBooks() {
        List<Object[]> raw = loanRepository.getMostPopularBooks();
        List<PopularBookResponse> list = new ArrayList<>();
        for (Object[] row : raw) {
            Long bookId = ((Number) row[0]).longValue();
            String title = (String) row[1];
            String author = (String) row[2];
            String category = (String) row[3];
            long borrowCount = ((Number) row[4]).longValue();
            list.add(new PopularBookResponse(bookId, title, author, category, borrowCount));
        }
        return list;
    }

    public MemberLoanHistoryResponse getMemberLoanHistory(String identifier) {
        Member member = memberService.resolveMember(identifier);
        List<Loan> history = loanRepository.findLoanHistoryByMember(member.getId());

        List<LoanResponse> historyResponses = history.stream()
                .map(loanService::toResponse)
                .collect(Collectors.toList());

        long activeCount = history.stream()
                .filter(l -> l.getReturnDate() == null)
                .count();

        MemberLoanHistoryResponse resp = new MemberLoanHistoryResponse();
        resp.setMemberId(member.getMemberCode());
        resp.setMemberName(member.getFullName());
        resp.setMemberEmail(member.getEmail());
        resp.setMembershipType(member.getMembershipType().name());
        resp.setStatus(member.getStatus().name());
        resp.setTotalLoansCount(history.size());
        resp.setActiveLoansCount(activeCount);
        resp.setHistory(historyResponses);
        return resp;
    }
}
