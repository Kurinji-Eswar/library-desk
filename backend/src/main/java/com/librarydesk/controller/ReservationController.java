package com.librarydesk.controller;

import com.librarydesk.dto.ApiResponse;
import com.librarydesk.dto.ReservationRequest;
import com.librarydesk.dto.ReservationResponse;
import com.librarydesk.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@Tag(name = "Reservations", description = "Endpoints for book reservation queue management")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    @Operation(summary = "List all reservations", description = "Filters hold queue reservations by status")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getAllReservations(
            @RequestParam(value = "status", required = false) String status) {
        List<ReservationResponse> reservations = reservationService.getAllReservations(status);
        return ResponseEntity.ok(ApiResponse.ok(reservations));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reservation by ID or Reservation Code")
    public ResponseEntity<ApiResponse<ReservationResponse>> getReservation(@PathVariable("id") String id) {
        ReservationResponse res = reservationService.getReservationByIdOrCode(id);
        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping
    @Operation(summary = "Create book reservation")
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(
            @Valid @RequestBody ReservationRequest request) {
        ReservationResponse created = reservationService.createReservation(request);
        return new ResponseEntity<>(ApiResponse.ok("Reservation placed successfully", created), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a pending reservation")
    public ResponseEntity<ApiResponse<ReservationResponse>> cancelReservation(@PathVariable("id") String id) {
        ReservationResponse updated = reservationService.cancelReservation(id);
        return ResponseEntity.ok(ApiResponse.ok("Reservation cancelled", updated));
    }

    @PostMapping("/{id}/ready")
    @Operation(summary = "Mark a reservation as READY for pickup")
    public ResponseEntity<ApiResponse<ReservationResponse>> markReady(@PathVariable("id") String id) {
        ReservationResponse updated = reservationService.markReady(id);
        return ResponseEntity.ok(ApiResponse.ok("Reservation marked ready", updated));
    }

    @PostMapping("/{id}/fulfill")
    @Operation(summary = "Fulfill a reservation into an active loan")
    public ResponseEntity<ApiResponse<ReservationResponse>> fulfillReservation(@PathVariable("id") String id) {
        ReservationResponse updated = reservationService.fulfillReservation(id);
        return ResponseEntity.ok(ApiResponse.ok("Reservation fulfilled into active loan", updated));
    }
}
