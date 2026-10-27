package com.librarydesk.service;

import com.librarydesk.dto.MemberRequest;
import com.librarydesk.dto.MemberResponse;
import com.librarydesk.exception.BusinessRuleException;
import com.librarydesk.exception.DuplicateResourceException;
import com.librarydesk.exception.ResourceNotFoundException;
import com.librarydesk.model.LoanStatus;
import com.librarydesk.model.Member;
import com.librarydesk.model.MemberStatus;
import com.librarydesk.model.MembershipType;
import com.librarydesk.repository.LoanRepository;
import com.librarydesk.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;
    private final LoanRepository loanRepository;

    public MemberService(MemberRepository memberRepository, LoanRepository loanRepository) {
        this.memberRepository = memberRepository;
        this.loanRepository = loanRepository;
    }

    @Transactional(readOnly = true)
    public List<MemberResponse> getAllMembers(String query, String status) {
        String trimmedQuery = (query != null && !query.trim().isEmpty()) ? query.trim().toLowerCase() : null;
        MemberStatus memberStatus = null;
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            try {
                memberStatus = MemberStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        List<Member> members;
        if (memberStatus != null) {
            members = memberRepository.findByStatusOrderByIdDesc(memberStatus);
        } else {
            members = memberRepository.findAllByOrderByIdDesc();
        }

        if (trimmedQuery != null) {
            members = members.stream()
                    .filter(m -> m.getFullName().toLowerCase().contains(trimmedQuery) ||
                                 m.getEmail().toLowerCase().contains(trimmedQuery) ||
                                 m.getMemberCode().toLowerCase().contains(trimmedQuery) ||
                                 (m.getPhone() != null && m.getPhone().toLowerCase().contains(trimmedQuery)))
                    .collect(Collectors.toList());
        }

        return members.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MemberResponse getMemberByIdOrCode(String identifier) {
        Member member = resolveMember(identifier);
        return toResponse(member);
    }

    public MemberResponse createMember(MemberRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (memberRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new DuplicateResourceException("A patron/member with email '" + cleanEmail + "' already exists.");
        }

        Member member = new Member();
        member.setMemberCode("MB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        member.setFullName(request.getName().trim());
        member.setEmail(cleanEmail);
        member.setPhone(request.getPhone());
        member.setAddress(request.getAddress());

        if (request.getMembershipType() != null && !request.getMembershipType().trim().isEmpty()) {
            try {
                member.setMembershipType(MembershipType.valueOf(request.getMembershipType().trim()));
            } catch (IllegalArgumentException e) {
                member.setMembershipType(MembershipType.Standard);
            }
        } else {
            member.setMembershipType(MembershipType.Standard);
        }

        member.setStatus(MemberStatus.ACTIVE);
        member.setJoinedAt(LocalDate.now());

        Member saved = memberRepository.save(member);
        return toResponse(saved);
    }

    public MemberResponse updateMember(String identifier, MemberRequest request) {
        Member member = resolveMember(identifier);
        String cleanEmail = request.getEmail().trim().toLowerCase();

        if (!member.getEmail().equalsIgnoreCase(cleanEmail) && memberRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new DuplicateResourceException("A member with email '" + cleanEmail + "' already exists.");
        }

        member.setFullName(request.getName().trim());
        member.setEmail(cleanEmail);
        member.setPhone(request.getPhone());
        member.setAddress(request.getAddress());

        if (request.getMembershipType() != null && !request.getMembershipType().trim().isEmpty()) {
            try {
                member.setMembershipType(MembershipType.valueOf(request.getMembershipType().trim()));
            } catch (IllegalArgumentException ignored) {}
        }

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            try {
                member.setStatus(MemberStatus.valueOf(request.getStatus().trim().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }

        Member updated = memberRepository.save(member);
        return toResponse(updated);
    }

    public MemberResponse toggleBlockMember(String identifier) {
        Member member = resolveMember(identifier);
        member.setStatus(member.getStatus() == MemberStatus.BLOCKED ? MemberStatus.ACTIVE : MemberStatus.BLOCKED);
        Member updated = memberRepository.save(member);
        return toResponse(updated);
    }

    public void deleteMember(String identifier) {
        Member member = resolveMember(identifier);

        var activeLoans = loanRepository.findByMemberIdAndStatusNot(member.getId(), LoanStatus.RETURNED);
        if (!activeLoans.isEmpty()) {
            throw new BusinessRuleException("Cannot delete member '" + member.getFullName() + "' because they have " + activeLoans.size() + " active/overdue loan(s). All loans must be returned first.");
        }

        memberRepository.delete(member);
    }

    public Member resolveMember(String identifier) {
        try {
            Long id = Long.parseLong(identifier);
            return memberRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + identifier));
        } catch (NumberFormatException e) {
            return memberRepository.findByMemberCode(identifier)
                    .or(() -> memberRepository.findByEmailIgnoreCase(identifier))
                    .orElseThrow(() -> new ResourceNotFoundException("Member not found with identifier: " + identifier));
        }
    }

    public MemberResponse toResponse(Member member) {
        long activeCount = loanRepository.findByMemberIdAndStatusNot(member.getId(), LoanStatus.RETURNED).size();
        MemberResponse resp = new MemberResponse();
        resp.setId(member.getMemberCode());
        resp.setDatabaseId(member.getId());
        resp.setMemberCode(member.getMemberCode());
        resp.setName(member.getFullName());
        resp.setEmail(member.getEmail());
        resp.setPhone(member.getPhone());
        resp.setAddress(member.getAddress());
        resp.setMembershipType(member.getMembershipType().name());
        resp.setStatus(member.getStatus().name());
        resp.setJoinedDate(member.getJoinedAt().format(DateTimeFormatter.ISO_LOCAL_DATE));
        resp.setActiveLoansCount(activeCount);
        return resp;
    }
}
