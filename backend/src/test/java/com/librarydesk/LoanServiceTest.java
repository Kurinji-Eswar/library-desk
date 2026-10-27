package com.librarydesk;

import com.librarydesk.dto.*;
import com.librarydesk.exception.BusinessRuleException;
import com.librarydesk.model.LoanStatus;
import com.librarydesk.model.MemberStatus;
import com.librarydesk.service.BookService;
import com.librarydesk.service.LoanService;
import com.librarydesk.service.MemberService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
class LoanServiceTest {

    @Autowired
    private LoanService loanService;

    @Autowired
    private BookService bookService;

    @Autowired
    private MemberService memberService;

    private BookResponse createSampleBook(int copies) {
        BookRequest b = new BookRequest();
        b.setTitle("Test Circulation Book " + System.nanoTime());
        b.setAuthor("Test Author");
        b.setIsbn("ISBN-" + System.nanoTime());
        b.setCategory("FICTION");
        b.setYear(2021);
        b.setTotalCopies(copies);
        return bookService.createBook(b);
    }

    private MemberResponse createSampleMember(MemberStatus status) {
        MemberRequest m = new MemberRequest();
        m.setName("Member " + System.nanoTime());
        m.setEmail("member." + System.nanoTime() + "@test.com");
        m.setStatus(status.name());
        MemberResponse resp = memberService.createMember(m);
        if (status == MemberStatus.BLOCKED) {
            resp = memberService.toggleBlockMember(resp.getId());
        }
        return resp;
    }

    @Test
    @DisplayName("Should issue available book and decrement available copy count exactly once")
    void testIssueAvailableBook() {
        BookResponse book = createSampleBook(3);
        MemberResponse member = createSampleMember(MemberStatus.ACTIVE);

        LoanRequest req = new LoanRequest(
                book.getId(),
                member.getId(),
                LocalDate.now().toString(),
                LocalDate.now().plusDays(14).toString()
        );

        LoanResponse loan = loanService.issueLoan(req);

        assertNotNull(loan);
        assertNotNull(loan.getId());
        assertEquals("ACTIVE", loan.getStatus());

        BookResponse reloadedBook = bookService.getBookByIdOrCode(book.getId());
        assertEquals(2, reloadedBook.getAvailableCopies());
    }

    @Test
    @DisplayName("Should reject issuing book when available copies is zero")
    void testRejectUnavailableBook() {
        BookResponse book = createSampleBook(1);
        MemberResponse member1 = createSampleMember(MemberStatus.ACTIVE);
        MemberResponse member2 = createSampleMember(MemberStatus.ACTIVE);

        LoanRequest req1 = new LoanRequest(book.getId(), member1.getId(), null, null);
        loanService.issueLoan(req1);

        LoanRequest req2 = new LoanRequest(book.getId(), member2.getId(), null, null);
        assertThrows(BusinessRuleException.class, () -> loanService.issueLoan(req2));
    }

    @Test
    @DisplayName("Should reject issuing book to a blocked member")
    void testRejectBlockedMember() {
        BookResponse book = createSampleBook(2);
        MemberResponse blockedMember = createSampleMember(MemberStatus.BLOCKED);

        LoanRequest req = new LoanRequest(book.getId(), blockedMember.getId(), null, null);
        assertThrows(BusinessRuleException.class, () -> loanService.issueLoan(req));
    }

    @Test
    @DisplayName("Should process return, increment available copy count exactly once, and reject duplicate return")
    void testProcessReturnAndRejectDuplicate() {
        BookResponse book = createSampleBook(2);
        MemberResponse member = createSampleMember(MemberStatus.ACTIVE);

        LoanRequest req = new LoanRequest(book.getId(), member.getId(), null, null);
        LoanResponse loan = loanService.issueLoan(req);

        assertEquals(1, bookService.getBookByIdOrCode(book.getId()).getAvailableCopies());

        // Process return
        ReturnRequest retReq = new ReturnRequest(false, LocalDate.now().toString());
        LoanResponse returned = loanService.processReturn(loan.getId(), retReq);

        assertEquals("RETURNED", returned.getStatus());
        assertEquals(2, bookService.getBookByIdOrCode(book.getId()).getAvailableCopies());

        // Attempting to return again must be rejected
        assertThrows(BusinessRuleException.class, () -> loanService.processReturn(loan.getId(), retReq));
    }

    @Test
    @DisplayName("Should calculate overdue fines at ₹5 per day for late returns")
    void testOverdueFineCalculation() {
        BookResponse book = createSampleBook(2);
        MemberResponse member = createSampleMember(MemberStatus.ACTIVE);

        LocalDate borrowDate = LocalDate.now().minusDays(20);
        LocalDate dueDate = LocalDate.now().minusDays(6); // 6 days overdue

        LoanRequest req = new LoanRequest(book.getId(), member.getId(), borrowDate.toString(), dueDate.toString());
        LoanResponse loan = loanService.issueLoan(req);

        ReturnRequest retReq = new ReturnRequest(false, LocalDate.now().toString());
        LoanResponse returned = loanService.processReturn(loan.getId(), retReq);

        // 6 days * 5 = 30.00
        assertEquals(BigDecimal.valueOf(30.00), returned.getFine());
    }
}
