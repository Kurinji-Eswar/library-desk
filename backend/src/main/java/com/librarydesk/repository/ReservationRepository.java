package com.librarydesk.repository;

import com.librarydesk.model.Reservation;
import com.librarydesk.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByReservationCode(String code);

    List<Reservation> findByBookIdAndStatusIn(Long bookId, Collection<ReservationStatus> statuses);

    Optional<Reservation> findByBookIdAndMemberIdAndStatusIn(Long bookId, Long memberId, Collection<ReservationStatus> statuses);

    List<Reservation> findByBookIdAndStatusOrderByQueuePositionAsc(Long bookId, ReservationStatus status);

    List<Reservation> findByStatus(ReservationStatus status);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.book.id = :bookId AND r.status IN ('WAITING', 'READY')")
    int countActiveReservationsForBook(@Param("bookId") Long bookId);

    @Query("SELECT r FROM Reservation r ORDER BY r.id DESC")
    List<Reservation> findAllOrderByLatest();
}
