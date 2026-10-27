package com.librarydesk.repository;

import com.librarydesk.model.Member;
import com.librarydesk.model.MemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByMemberCode(String code);
    Optional<Member> findByEmailIgnoreCase(String email);
    boolean existsByMemberCode(String code);
    boolean existsByEmailIgnoreCase(String email);
    List<Member> findByStatus(MemberStatus status);

    List<Member> findAllByOrderByIdDesc();
    List<Member> findByStatusOrderByIdDesc(MemberStatus status);
}
