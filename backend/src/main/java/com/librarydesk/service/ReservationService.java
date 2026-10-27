package com.librarydesk.service;

import com.librarydesk.dto.LoanRequest;
import com.librarydesk.dto.ReservationRequest;
import com.librarydesk.dto.ReservationResponse;
import com.librarydesk.exception.BusinessRuleException;
import com.librarydesk.exception.DuplicateResourceException;
import com.librarydesk.exception.ResourceNotFoundException;
import com.librarydesk.model.Book;
import com.librarydesk.model.Member;
import com.librarydesk.model.Reservation;
import com.librarydesk.model.ReservationStatus;
import com.librarydesk.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BookService bookService;
    private final MemberService memberService;
    private final LoanService loanService;

    public ReservationService(ReservationRepository reservationRepository,
                              BookService bookService,
                              MemberService memberService,
                              LoanService loanService) {
        this.reservationRepository = reservationRepository;
        this.bookService = bookService;
        this.memberService = memberService;
        this.loanService = loanService;
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getAllReservations(String status) {
        List<Reservation> reservations = reservationRepository.findAllOrderByLatest();
        return reservations.stream()
                .filter(r -> {
                    if (status == null || status.trim().isEmpty() || status.equalsIgnoreCase("ALL")) return true;
                    return r.getStatus().name().equalsIgnoreCase(status.trim());
                })
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservationResponse getReservationByIdOrCode(String identifier) {
        Reservation res = resolveReservation(identifier);
        return toResponse(res);
    }

    public ReservationResponse createReservation(ReservationRequest request) {
        Book book = bookService.resolveBook(request.getBookId());
        Member member = memberService.resolveMember(request.getMemberId());

        var activeReservation = reservationRepository.findByBookIdAndMemberIdAndStatusIn(
                book.getId(), member.getId(), List.of(ReservationStatus.WAITING, ReservationStatus.READY));
        if (activeReservation.isPresent()) {
            throw new DuplicateResourceException("Member '" + member.getFullName() + "' already has an active reservation for '" + book.getTitle() + "'.");
        }

        LocalDate reqDate = (request.getRequestedDate() != null && !request.getRequestedDate().trim().isEmpty())
                ? LocalDate.parse(request.getRequestedDate().trim())
                : LocalDate.now();

        int queueCount = reservationRepository.countActiveReservationsForBook(book.getId());

        Reservation reservation = new Reservation();
        reservation.setReservationCode("RS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        reservation.setBook(book);
        reservation.setMember(member);
        reservation.setReservationDate(reqDate);
        reservation.setQueuePosition(queueCount + 1);
        reservation.setStatus(ReservationStatus.WAITING);

        Reservation saved = reservationRepository.save(reservation);
        return toResponse(saved);
    }

    public ReservationResponse cancelReservation(String identifier) {
        Reservation reservation = resolveReservation(identifier);
        if (reservation.getStatus() == ReservationStatus.FULFILLED) {
            throw new BusinessRuleException("Cannot cancel an already fulfilled reservation.");
        }
        reservation.setStatus(ReservationStatus.CANCELLED);
        Reservation updated = reservationRepository.save(reservation);
        return toResponse(updated);
    }

    public ReservationResponse markReady(String identifier) {
        Reservation reservation = resolveReservation(identifier);
        reservation.setStatus(ReservationStatus.READY);
        Reservation updated = reservationRepository.save(reservation);
        return toResponse(updated);
    }

    public ReservationResponse fulfillReservation(String identifier) {
        Reservation reservation = resolveReservation(identifier);
        if (reservation.getStatus() == ReservationStatus.FULFILLED) {
            throw new BusinessRuleException("Reservation is already fulfilled.");
        }

        // Issue loan for this reservation
        LoanRequest loanReq = new LoanRequest(
                reservation.getBook().getCode(),
                reservation.getMember().getMemberCode(),
                LocalDate.now().toString(),
                LocalDate.now().plusDays(14).toString()
        );
        loanService.issueLoan(loanReq);

        reservation.setStatus(ReservationStatus.FULFILLED);
        reservation.setFulfilledAt(OffsetDateTime.now());
        Reservation updated = reservationRepository.save(reservation);
        return toResponse(updated);
    }

    public Reservation resolveReservation(String identifier) {
        try {
            Long id = Long.parseLong(identifier);
            return reservationRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + identifier));
        } catch (NumberFormatException e) {
            return reservationRepository.findByReservationCode(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with code: " + identifier));
        }
    }

    public ReservationResponse toResponse(Reservation res) {
        ReservationResponse resp = new ReservationResponse();
        resp.setId(res.getReservationCode());
        resp.setDatabaseId(res.getId());
        resp.setReservationCode(res.getReservationCode());
        resp.setBookId(res.getBook().getCode());
        resp.setBookDatabaseId(res.getBook().getId());
        resp.setBookTitle(res.getBook().getTitle());
        resp.setMemberId(res.getMember().getMemberCode());
        resp.setMemberDatabaseId(res.getMember().getId());
        resp.setMemberName(res.getMember().getFullName());
        resp.setRequestedDate(res.getReservationDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
        resp.setPosition(res.getQueuePosition());
        resp.setStatus(res.getStatus().name());
        return resp;
    }
}
