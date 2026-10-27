package com.librarydesk;

import com.librarydesk.dto.BookRequest;
import com.librarydesk.dto.BookResponse;
import com.librarydesk.exception.BusinessRuleException;
import com.librarydesk.exception.DuplicateResourceException;
import com.librarydesk.service.BookService;
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
class BookServiceTest {

    @Autowired
    private BookService bookService;

    @Test
    @DisplayName("Should successfully create a valid book")
    void testCreateValidBook() {
        BookRequest req = new BookRequest();
        req.setTitle("Refactoring");
        req.setAuthor("Martin Fowler");
        req.setIsbn("978-0134757599");
        req.setCategory("TECHNOLOGY");
        req.setPublisher("Addison-Wesley");
        req.setYear(2018);
        req.setTotalCopies(5);
        req.setShelf("T1");
        req.setDescription("Improving the design of existing code");

        BookResponse resp = bookService.createBook(req);

        assertNotNull(resp);
        assertNotNull(resp.getId());
        assertEquals("Refactoring", resp.getTitle());
        assertEquals(5, resp.getTotalCopies());
        assertEquals(5, resp.getAvailableCopies());
    }

    @Test
    @DisplayName("Should reject book creation with duplicate ISBN")
    void testRejectDuplicateIsbn() {
        BookRequest req1 = new BookRequest();
        req1.setTitle("Domain-Driven Design");
        req1.setAuthor("Eric Evans");
        req1.setIsbn("978-0321125217");
        req1.setCategory("TECHNOLOGY");
        req1.setYear(2003);
        req1.setTotalCopies(3);

        bookService.createBook(req1);

        BookRequest req2 = new BookRequest();
        req2.setTitle("Duplicate DDD Book");
        req2.setAuthor("Another Author");
        req2.setIsbn("978-0321125217");
        req2.setCategory("TECHNOLOGY");
        req2.setYear(2010);
        req2.setTotalCopies(2);

        assertThrows(DuplicateResourceException.class, () -> bookService.createBook(req2));
    }

    @Test
    @DisplayName("Should update book details and maintain inventory consistency")
    void testUpdateBook() {
        BookRequest req = new BookRequest();
        req.setTitle("Original Title");
        req.setAuthor("Original Author");
        req.setIsbn("978-1111111111");
        req.setCategory("FICTION");
        req.setYear(2000);
        req.setTotalCopies(4);

        BookResponse created = bookService.createBook(req);

        BookRequest updateReq = new BookRequest();
        updateReq.setTitle("Updated Title");
        updateReq.setAuthor("Updated Author");
        updateReq.setIsbn("978-1111111111");
        updateReq.setCategory("FICTION");
        updateReq.setYear(2005);
        updateReq.setTotalCopies(6);
        updateReq.setShelf("B2");

        BookResponse updated = bookService.updateBook(created.getId(), updateReq);

        assertEquals("Updated Title", updated.getTitle());
        assertEquals(6, updated.getTotalCopies());
        assertEquals(6, updated.getAvailableCopies());
    }
}
