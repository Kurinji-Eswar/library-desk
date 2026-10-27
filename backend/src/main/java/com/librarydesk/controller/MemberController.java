package com.librarydesk.controller;

import com.librarydesk.dto.ApiResponse;
import com.librarydesk.dto.MemberRequest;
import com.librarydesk.dto.MemberResponse;
import com.librarydesk.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@Tag(name = "Members", description = "Endpoints for library patrons and members directory")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping
    @Operation(summary = "Search and list members", description = "Filters members by search query and membership status")
    public ResponseEntity<ApiResponse<List<MemberResponse>>> getAllMembers(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "status", required = false) String status) {
        List<MemberResponse> members = memberService.getAllMembers(query, status);
        return ResponseEntity.ok(ApiResponse.ok(members));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get member by ID or Member Code")
    public ResponseEntity<ApiResponse<MemberResponse>> getMember(@PathVariable("id") String id) {
        MemberResponse member = memberService.getMemberByIdOrCode(id);
        return ResponseEntity.ok(ApiResponse.ok(member));
    }

    @PostMapping
    @Operation(summary = "Register new member")
    public ResponseEntity<ApiResponse<MemberResponse>> createMember(@Valid @RequestBody MemberRequest request) {
        MemberResponse created = memberService.createMember(request);
        return new ResponseEntity<>(ApiResponse.ok("Member registered successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update member details")
    public ResponseEntity<ApiResponse<MemberResponse>> updateMember(
            @PathVariable("id") String id,
            @Valid @RequestBody MemberRequest request) {
        MemberResponse updated = memberService.updateMember(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Member updated successfully", updated));
    }

    @PatchMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle member status between ACTIVE and BLOCKED")
    public ResponseEntity<ApiResponse<MemberResponse>> toggleStatus(@PathVariable("id") String id) {
        MemberResponse updated = memberService.toggleBlockMember(id);
        return ResponseEntity.ok(ApiResponse.ok("Member status toggled to " + updated.getStatus(), updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete member (guarded by active loans)")
    public ResponseEntity<ApiResponse<Void>> deleteMember(@PathVariable("id") String id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok(ApiResponse.ok("Member removed successfully", null));
    }
}
