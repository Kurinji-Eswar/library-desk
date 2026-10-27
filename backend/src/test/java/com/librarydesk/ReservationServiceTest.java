package com.librarydesk;

import com.librarydesk.dto.BookRequest;
import com.librarydesk.dto.BookResponse;
import com.librarydesk.dto.MemberRequest;
import com.librarydesk.dto.MemberResponse;
import com.librarydesk.dto.ReservationRequest;
import com.librarydesk.dto.ReservationResponse;
import com.librarydesk.exception.DuplicateResourceException;
import com.librarydesk.service.BookService;
import com.librarydesk.service.MemberService;
import com.librarydesk.service.ReservationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
class ReservationServiceTest {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private BookService bookService;

    @Autowired
    private MemberService memberService;

    private BookResponse createSampleBook() {
        BookRequest b = new BookRequest();
        b.setTitle("Reserved Book " + System.nanoTime());
        b.setAuthor("Sample Author");
        b.setIsbn("RES-ISBN-" + System.nanoTime());
        b.setCategory("SCIENCE");
        b.setYear(2022);
        b.setTotalCopies(2);
        return bookService.createBook(b);
    }

    private MemberResponse createSampleMember() {
        MemberRequest m = new MemberRequest();
        m.setName("Patron " + System.nanoTime());
        m.setEmail("patron." + System.nanoTime() + "@test.com");
        return memberService.createMember(m);
    }

    @Test
    @DisplayName("Should create reservation and assign queue position")
    void testCreateReservation() {
        BookResponse book = createSampleBook();
        MemberResponse member = createSampleMember();

        ReservationRequest req = new ReservationRequest(book.getId(), member.getId(), LocalDate.now().toString());
        ReservationResponse res = reservationService.createReservation(req);

        assertNotNull(res);
        assertNotNull(res.getId());
        assertEquals("WAITING", res.getStatus());
        assertEquals(1, res.getPosition());
    }

    @Test
    @DisplayName("Should reject duplicate active reservation for same member and book")
    void testRejectDuplicateActiveReservation() {
        BookResponse book = createSampleBook();
        MemberResponse member = createSampleMember();

        ReservationRequest req = new ReservationRequest(book.getId(), member.getId(), LocalDate.now().toString());
        reservationService.createReservation(req);

        assertThrows(DuplicateResourceException.class, () -> reservationService.createReservation(req));
    }

    @Test
    @DisplayName("Should cancel reservation successfully")
    void testCancelReservation() {
        BookResponse book = createSampleBook();
        MemberResponse member = createSampleMember();

        ReservationRequest req = new ReservationRequest(book.getId(), member.getId(), LocalDate.now().toString());
        ReservationResponse res = reservationService.createReservation(req);

        ReservationResponse cancelled = reservationService.cancelReservation(res.getId());
        assertEquals("CANCELLED", cancelled.getStatus());
    }
}
