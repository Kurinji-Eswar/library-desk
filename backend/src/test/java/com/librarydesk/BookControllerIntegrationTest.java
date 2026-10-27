package com.librarydesk;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.librarydesk.dto.BookRequest;
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
class BookControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/books should return 200 with list of books")
    void testGetAllBooksEndpoint() throws Exception {
        mockMvc.perform(get("/api/books")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/books should return 201 Created on valid input")
    void testCreateBookEndpoint() throws Exception {
        BookRequest req = new BookRequest();
        req.setTitle("Effective Java");
        req.setAuthor("Joshua Bloch");
        req.setIsbn("978-0134685991");
        req.setCategory("TECHNOLOGY");
        req.setYear(2018);
        req.setTotalCopies(4);

        mockMvc.perform(post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.title", is("Effective Java")))
                .andExpect(jsonPath("$.data.availableCopies", is(4)));
    }

    @Test
    @DisplayName("POST /api/books should return 422 Unprocessable Entity on validation failure")
    void testCreateBookValidationFailure() throws Exception {
        BookRequest invalid = new BookRequest();
        // Missing title, author, isbn, etc.

        mockMvc.perform(post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.error", is("Validation Failed")))
                .andExpect(jsonPath("$.validationErrors", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/books/NONEXISTENT should return 404 Not Found")
    void testGetNonExistentBook() throws Exception {
        mockMvc.perform(get("/api/books/NONEXISTENT-99999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", is("Not Found")));
    }
}
