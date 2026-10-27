package com.librarydesk.service;

import com.librarydesk.dto.DashboardSummaryResponse;
import com.librarydesk.dto.RecentActivityResponse;
import com.librarydesk.model.Book;
import com.librarydesk.model.Loan;
import com.librarydesk.model.LoanStatus;
import com.librarydesk.model.Member;
import com.librarydesk.repository.BookRepository;
import com.librarydesk.repository.CategoryRepository;
import com.librarydesk.repository.LoanRepository;
import com.librarydesk.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final CategoryRepository categoryRepository;
    private final LoanRepository loanRepository;

    public DashboardService(BookRepository bookRepository,
                            MemberRepository memberRepository,
                            CategoryRepository categoryRepository,
                            LoanRepository loanRepository) {
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
        this.categoryRepository = categoryRepository;
        this.loanRepository = loanRepository;
    }

    public DashboardSummaryResponse getSummary() {
        List<Book> books = bookRepository.findAll();
        long totalCopies = books.stream().mapToLong(Book::getTotalCopies).sum();
        long availableCopies = books.stream().mapToLong(Book::getAvailableCopies).sum();
        long borrowedCopies = Math.max(0, totalCopies - availableCopies);

        LocalDate today = LocalDate.now();
        long overdueCount = loanRepository.findByStatusNotAndDueDateBefore(LoanStatus.RETURNED, today).size();
        long dueTodayCount = loanRepository.findByStatusNotAndDueDate(LoanStatus.RETURNED, today).size();
        long activeLoansCount = loanRepository.countByStatusNot(LoanStatus.RETURNED);
        long totalMembers = memberRepository.count();
        long totalCategories = categoryRepository.count();
        BigDecimal totalFines = loanRepository.getTotalFinesCollected();

        DashboardSummaryResponse resp = new DashboardSummaryResponse();
        resp.setTotalBooks(totalCopies);
        resp.setAvailable(availableCopies);
        resp.setBorrowed(borrowedCopies);
        resp.setOverdue(overdueCount);
        resp.setDueToday(dueTodayCount);
        resp.setActiveLoans(activeLoansCount);
        resp.setTotalMembers(totalMembers);
        resp.setTotalCategories(totalCategories);
        resp.setTotalFines(totalFines != null ? totalFines : BigDecimal.ZERO);
        return resp;
    }

    public List<RecentActivityResponse> getRecentActivity() {
        List<RecentActivityResponse> activities = new ArrayList<>();

        // Latest loans
        List<Loan> recentLoans = loanRepository.findAll();
        recentLoans.stream()
                .sorted(Comparator.comparing(Loan::getId).reversed())
                .limit(10)
                .forEach(l -> {
                    if (l.getStatus() == LoanStatus.RETURNED && l.getReturnDate() != null) {
                        activities.add(new RecentActivityResponse(
                                "ACT-RET-" + l.getId(),
                                "BOOK RETURNED",
                                "\"" + l.getBook().getTitle() + "\" returned by " + l.getMember().getFullName(),
                                l.getUpdatedAt() != null ? l.getUpdatedAt() : l.getReturnDate().atStartOfDay().atOffset(ZoneOffset.UTC)
                        ));
                    } else {
                        activities.add(new RecentActivityResponse(
                                "ACT-LN-" + l.getId(),
                                "BOOK BORROWED",
                                "\"" + l.getBook().getTitle() + "\" issued to " + l.getMember().getFullName(),
                                l.getCreatedAt() != null ? l.getCreatedAt() : l.getIssueDate().atStartOfDay().atOffset(ZoneOffset.UTC)
                        ));
                    }
                });

        // Latest members
        List<Member> recentMembers = memberRepository.findAll();
        recentMembers.stream()
                .sorted(Comparator.comparing(Member::getId).reversed())
                .limit(5)
                .forEach(m -> activities.add(new RecentActivityResponse(
                        "ACT-MB-" + m.getId(),
                        "NEW MEMBER",
                        "Patron \"" + m.getFullName() + "\" registered",
                        m.getCreatedAt() != null ? m.getCreatedAt() : m.getJoinedAt().atStartOfDay().atOffset(ZoneOffset.UTC)
                )));

        // Latest books
        List<Book> recentBooks = bookRepository.findAll();
        recentBooks.stream()
                .sorted(Comparator.comparing(Book::getId).reversed())
                .limit(5)
                .forEach(b -> activities.add(new RecentActivityResponse(
                        "ACT-BK-" + b.getId(),
                        "BOOK ADDED",
                        "\"" + b.getTitle() + "\" added to catalog",
                        b.getCreatedAt() != null ? b.getCreatedAt() : OffsetDateTime.now()
                )));

        activities.sort(Comparator.comparing(RecentActivityResponse::getAt).reversed());
        return activities.stream().limit(20).toList();
    }
}
