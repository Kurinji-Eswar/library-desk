package com.librarydesk;

import com.librarydesk.dto.MemberRequest;
import com.librarydesk.dto.MemberResponse;
import com.librarydesk.exception.DuplicateResourceException;
import com.librarydesk.service.MemberService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
class MemberServiceTest {

    @Autowired
    private MemberService memberService;

    @Test
    @DisplayName("Should create member and assign ACTIVE status")
    void testCreateMember() {
        MemberRequest req = new MemberRequest();
        req.setName("Kavitha Raman");
        req.setEmail("kavitha.raman@test.com");
        req.setPhone("+91 98888 77777");
        req.setAddress("Chennai, TN");
        req.setMembershipType("Premium");

        MemberResponse resp = memberService.createMember(req);

        assertNotNull(resp);
        assertNotNull(resp.getId());
        assertEquals("Kavitha Raman", resp.getName());
        assertEquals("kavitha.raman@test.com", resp.getEmail());
        assertEquals("ACTIVE", resp.getStatus());
        assertEquals("Premium", resp.getMembershipType());
    }

    @Test
    @DisplayName("Should reject duplicate member email")
    void testRejectDuplicateEmail() {
        MemberRequest req1 = new MemberRequest();
        req1.setName("User One");
        req1.setEmail("unique@test.com");

        memberService.createMember(req1);

        MemberRequest req2 = new MemberRequest();
        req2.setName("User Two");
        req2.setEmail("unique@test.com");

        assertThrows(DuplicateResourceException.class, () -> memberService.createMember(req2));
    }

    @Test
    @DisplayName("Should toggle member status between ACTIVE and BLOCKED")
    void testToggleBlockMember() {
        MemberRequest req = new MemberRequest();
        req.setName("Suresh Raina");
        req.setEmail("suresh.r@test.com");

        MemberResponse created = memberService.createMember(req);
        assertEquals("ACTIVE", created.getStatus());

        MemberResponse blocked = memberService.toggleBlockMember(created.getId());
        assertEquals("BLOCKED", blocked.getStatus());

        MemberResponse unblocked = memberService.toggleBlockMember(created.getId());
        assertEquals("ACTIVE", unblocked.getStatus());
    }
}
