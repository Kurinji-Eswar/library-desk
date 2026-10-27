package com.librarydesk;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.librarydesk.dto.BookRequest;
import com.librarydesk.dto.BookResponse;
import com.librarydesk.dto.LoanRequest;
import com.librarydesk.dto.MemberRequest;
import com.librarydesk.dto.MemberResponse;
import com.librarydesk.service.BookService;
import com.librarydesk.service.MemberService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
class LoanControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BookService bookService;

    @Autowired
    private MemberService memberService;

    @Test
    @DisplayName("POST /api/loans should issue loan and return 201 Created")
    void testIssueLoanEndpoint() throws Exception {
        BookRequest b = new BookRequest();
        b.setTitle("Spring in Action");
        b.setAuthor("Craig Walls");
        b.setIsbn("978-1617294945");
        b.setCategory("TECHNOLOGY");
        b.setYear(2018);
        b.setTotalCopies(3);
        BookResponse book = bookService.createBook(b);

        MemberRequest m = new MemberRequest();
        m.setName("Anandhi S");
        m.setEmail("anandhi@test.com");
        MemberResponse member = memberService.createMember(m);

        LoanRequest req = new LoanRequest(book.getId(), member.getId(), null, null);

        mockMvc.perform(post("/api/loans")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.bookId", is(book.getId())))
                .andExpect(jsonPath("$.data.memberId", is(member.getId())))
                .andExpect(jsonPath("$.data.status", is("ACTIVE")));
    }
}
