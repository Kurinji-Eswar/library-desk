package com.librarydesk.service;

import com.librarydesk.dto.LoanRequest;
import com.librarydesk.dto.LoanResponse;
import com.librarydesk.dto.ReturnRequest;
import com.librarydesk.exception.BusinessRuleException;
import com.librarydesk.exception.DuplicateResourceException;
import com.librarydesk.exception.ResourceNotFoundException;
import com.librarydesk.model.*;
import com.librarydesk.repository.BookRepository;
import com.librarydesk.repository.LoanRepository;
import com.librarydesk.repository.MemberRepository;
import com.librarydesk.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class LoanService {

    public static final BigDecimal DAILY_FINE_RATE = BigDecimal.valueOf(5.00);

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final ReservationRepository reservationRepository;
    private final BookService bookService;
    private final MemberService memberService;

    public LoanService(LoanRepository loanRepository,
                       BookRepository bookRepository,
                       MemberRepository memberRepository,
                       ReservationRepository reservationRepository,
                       BookService bookService,
                       MemberService memberService) {
        this.loanRepository = loanRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
        this.reservationRepository = reservationRepository;
        this.bookService = bookService;
        this.memberService = memberService;
    }

    @Transactional(readOnly = true)
    public List<LoanResponse> getAllLoans(String status) {
        List<Loan> loans = loanRepository.findAll();
        LocalDate today = LocalDate.now();

        return loans.stream()
                .map(loan -> computeLiveLoan(loan, today))
                .filter(loan -> {
                    if (status == null || status.trim().isEmpty() || status.equalsIgnoreCase("ALL")) return true;
                    return loan.getStatus().name().equalsIgnoreCase(status.trim()) ||
                           loan.getStatus().toDisplayString().equalsIgnoreCase(status.trim());
                })
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LoanResponse> getOverdueLoans() {
        LocalDate today = LocalDate.now();
        return loanRepository.findByStatusNotAndDueDateBefore(LoanStatus.RETURNED, today).stream()
                .map(loan -> computeLiveLoan(loan, today))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LoanResponse getLoanByIdOrCode(String identifier) {
        Loan loan = resolveLoan(identifier);
        return toResponse(computeLiveLoan(loan, LocalDate.now()));
    }

    public LoanResponse issueLoan(LoanRequest request) {
        Book book = bookService.resolveBook(request.getBookId());
        Member member = memberService.resolveMember(request.getMemberId());

        if (member.getStatus() == MemberStatus.BLOCKED) {
            throw new BusinessRuleException("Cannot issue book to member '" + member.getFullName() + "' because the membership status is BLOCKED.");
        }

        if (book.getAvailableCopies() < 1) {
            throw new BusinessRuleException("Book '" + book.getTitle() + "' has 0 copies available for borrowing.");
        }

        var existingLoan = loanRepository.findByBookIdAndMemberIdAndStatusNot(book.getId(), member.getId(), LoanStatus.RETURNED);
        if (existingLoan.isPresent()) {
            throw new DuplicateResourceException("Member '" + member.getFullName() + "' already has an active loan for '" + book.getTitle() + "'.");
        }

        LocalDate borrowedDate = (request.getBorrowedDate() != null && !request.getBorrowedDate().trim().isEmpty())
                ? LocalDate.parse(request.getBorrowedDate().trim())
                : LocalDate.now();

        LocalDate dueDate = (request.getDueDate() != null && !request.getDueDate().trim().isEmpty())
                ? LocalDate.parse(request.getDueDate().trim())
                : borrowedDate.plusDays(14);

        if (dueDate.isBefore(borrowedDate)) {
            throw new BusinessRuleException("Due date (" + dueDate + ") cannot be before issue date (" + borrowedDate + ").");
        }

        // Decrement available copies transactionally
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        Loan loan = new Loan();
        loan.setLoanCode("LN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        loan.setBook(book);
        loan.setMember(member);
        loan.setIssueDate(borrowedDate);
        loan.setDueDate(dueDate);
        loan.setStatus(LoanStatus.ACTIVE);
        loan.setFineAmount(BigDecimal.ZERO);

        Loan saved = loanRepository.save(loan);
        return toResponse(computeLiveLoan(saved, LocalDate.now()));
    }

    public LoanResponse processReturn(String identifier, ReturnRequest request) {
        Loan loan = resolveLoan(identifier);

        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new BusinessRuleException("Loan " + loan.getLoanCode() + " has already been returned on " + loan.getReturnDate() + ". Cannot return twice.");
        }

        LocalDate returnDate = (request != null && request.getReturnDate() != null && !request.getReturnDate().trim().isEmpty())
                ? LocalDate.parse(request.getReturnDate().trim())
                : LocalDate.now();

        BigDecimal fine = BigDecimal.ZERO;
        if (returnDate.isAfter(loan.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(loan.getDueDate(), returnDate);
            fine = DAILY_FINE_RATE.multiply(BigDecimal.valueOf(daysOverdue));
        }

        if (request != null && request.isWaiveFine()) {
            fine = BigDecimal.ZERO;
        }

        loan.setReturnDate(returnDate);
        loan.setStatus(LoanStatus.RETURNED);
        loan.setFineAmount(fine);
        Loan savedLoan = loanRepository.save(loan);

        // Restock available copies safely
        Book book = loan.getBook();
        book.setAvailableCopies(Math.min(book.getTotalCopies(), book.getAvailableCopies() + 1));
        bookRepository.save(book);

        // Promote first waiting reservation if any
        List<Reservation> waitingReservations = reservationRepository.findByBookIdAndStatusOrderByQueuePositionAsc(
                book.getId(), ReservationStatus.WAITING);
        if (!waitingReservations.isEmpty()) {
            Reservation firstWaiting = waitingReservations.get(0);
            firstWaiting.setStatus(ReservationStatus.READY);
            reservationRepository.save(firstWaiting);
        }

        return toResponse(savedLoan);
    }

    public Loan resolveLoan(String identifier) {
        try {
            Long id = Long.parseLong(identifier);
            return loanRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Loan not found with ID: " + identifier));
        } catch (NumberFormatException e) {
            return loanRepository.findByLoanCode(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("Loan not found with code: " + identifier));
        }
    }

    private Loan computeLiveLoan(Loan loan, LocalDate today) {
        if (loan.getStatus() == LoanStatus.RETURNED) {
            return loan;
        }

        if (today.isAfter(loan.getDueDate())) {
            long days = ChronoUnit.DAYS.between(loan.getDueDate(), today);
            loan.setStatus(LoanStatus.OVERDUE);
            loan.setFineAmount(DAILY_FINE_RATE.multiply(BigDecimal.valueOf(days)));
        } else if (today.isEqual(loan.getDueDate())) {
            loan.setStatus(LoanStatus.DUE_TODAY);
            loan.setFineAmount(BigDecimal.ZERO);
        } else {
            loan.setStatus(LoanStatus.ACTIVE);
            loan.setFineAmount(BigDecimal.ZERO);
        }
        return loan;
    }

    public LoanResponse toResponse(Loan loan) {
        LoanResponse resp = new LoanResponse();
        resp.setId(loan.getLoanCode());
        resp.setDatabaseId(loan.getId());
        resp.setLoanCode(loan.getLoanCode());
        resp.setBookId(loan.getBook().getCode());
        resp.setBookDatabaseId(loan.getBook().getId());
        resp.setBookTitle(loan.getBook().getTitle());
        resp.setBookAuthor(loan.getBook().getAuthor());
        resp.setMemberId(loan.getMember().getMemberCode());
        resp.setMemberDatabaseId(loan.getMember().getId());
        resp.setMemberName(loan.getMember().getFullName());
        resp.setMemberEmail(loan.getMember().getEmail());
        resp.setBorrowedDate(loan.getIssueDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
        resp.setDueDate(loan.getDueDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
        if (loan.getReturnDate() != null) {
            resp.setReturnedDate(loan.getReturnDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
        }
        resp.setStatus(loan.getStatus().toDisplayString());
        resp.setFine(loan.getFineAmount());
        return resp;
    }
}
