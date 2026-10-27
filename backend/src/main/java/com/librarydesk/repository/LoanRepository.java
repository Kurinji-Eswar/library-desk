package com.librarydesk.repository;

import com.librarydesk.model.Loan;
import com.librarydesk.model.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    Optional<Loan> findByLoanCode(String code);

    List<Loan> findByBookIdAndStatusNot(Long bookId, LoanStatus status);

    List<Loan> findByMemberIdAndStatusNot(Long memberId, LoanStatus status);

    Optional<Loan> findByBookIdAndMemberIdAndStatusNot(Long bookId, Long memberId, LoanStatus status);

    List<Loan> findByStatus(LoanStatus status);

    List<Loan> findByStatusNot(LoanStatus status);

    List<Loan> findByStatusNotAndDueDateBefore(LoanStatus status, LocalDate currentDate);

    List<Loan> findByStatusNotAndDueDate(LoanStatus status, LocalDate currentDate);

    @Query("SELECT l.book.id, l.book.title, l.book.author, l.book.category.name, COUNT(l) " +
           "FROM Loan l GROUP BY l.book.id, l.book.title, l.book.author, l.book.category.name " +
           "ORDER BY COUNT(l) DESC")
    List<Object[]> getMostPopularBooks();

    @Query("SELECT l FROM Loan l WHERE l.member.id = :memberId ORDER BY l.id DESC")
    List<Loan> findLoanHistoryByMember(@Param("memberId") Long memberId);

    @Query("SELECT COALESCE(SUM(l.fineAmount), 0.0) FROM Loan l")
    BigDecimal getTotalFinesCollected();

    long countByStatusNot(LoanStatus status);
}
