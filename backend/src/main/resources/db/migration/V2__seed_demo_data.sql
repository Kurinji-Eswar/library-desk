-- =============================================================================
-- Migration V2: Demonstration Seed Data for LIBRARY / DESK
-- Matches the existing client-side demo dataset for seamless continuity
-- =============================================================================

-- 1. Insert Categories
INSERT INTO categories (code, name, description) VALUES
('CAT-01', 'FICTION', 'Literary fiction, novels, and classics'),
('CAT-02', 'NON-FICTION', 'Informative literature, essays, and journalism'),
('CAT-03', 'SCIENCE', 'Physics, astronomy, biology, and chemistry'),
('CAT-04', 'TECHNOLOGY', 'Computer science, programming, and software engineering'),
('CAT-05', 'HISTORY', 'World history, civilizations, and historical events'),
('CAT-06', 'BIOGRAPHY', 'Biographies, autobiographies, and memoirs'),
('CAT-07', 'SELF HELP', 'Personal growth, productivity, and mindset'),
('CAT-08', 'BUSINESS', 'Economics, investing, entrepreneurship, and management'),
('CAT-09', 'PHILOSOPHY', 'Classical and modern philosophical thought'),
('CAT-10', 'CHILDREN', 'Children literature, illustrated stories, and fairy tales'),
('CAT-11', 'REFERENCE', 'Dictionaries, encyclopedias, and reference manuals');

-- 2. Insert Books
INSERT INTO books (code, isbn, title, author, publisher, publication_year, category_id, total_copies, available_copies, shelf_location) VALUES
('BK-001', '978-0743273565', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Scribner', 1925, 1, 4, 3, 'A1'),
('BK-002', '978-0060935467', 'To Kill a Mockingbird', 'Harper Lee', 'J. B. Lippincott & Co.', 1960, 1, 3, 2, 'A2'),
('BK-003', '978-0451524935', '1984', 'George Orwell', 'Secker & Warburg', 1949, 1, 5, 3, 'A3'),
('BK-004', '978-0141439518', 'Pride and Prejudice', 'Jane Austen', 'T. Egerton', 1813, 1, 3, 2, 'B1'),
('BK-005', '978-0547928227', 'The Hobbit', 'J.R.R. Tolkien', 'George Allen & Unwin', 1937, 1, 4, 3, 'B2'),
('BK-006', '978-0132350884', 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, 4, 6, 4, 'B3'),
('BK-007', '978-0201616224', 'The Pragmatic Programmer', 'Andrew Hunt', 'Addison-Wesley', 1999, 4, 5, 3, 'C1'),
('BK-008', '978-0735211292', 'Atomic Habits', 'James Clear', 'Avery', 2018, 7, 7, 5, 'C2'),
('BK-009', '978-0062316097', 'Sapiens', 'Yuval Noah Harari', 'Harvill Secker', 2011, 2, 6, 4, 'C3'),
('BK-010', '978-0553380163', 'A Brief History of Time', 'Stephen Hawking', 'Bantam Books', 1988, 3, 4, 3, 'D1'),
('BK-011', '978-0062315007', 'The Alchemist', 'Paulo Coelho', 'HarperTorch', 1988, 1, 5, 4, 'D2'),
('BK-012', '978-1455586691', 'Deep Work', 'Cal Newport', 'Grand Central', 2016, 7, 3, 2, 'A1'),
('BK-013', '978-0143130726', 'Ikigai', 'Hector Garcia', 'Penguin', 2016, 7, 4, 3, 'A2'),
('BK-014', '978-1451648539', 'Steve Jobs', 'Walter Isaacson', 'Simon & Schuster', 2011, 6, 3, 2, 'A3'),
('BK-015', '978-0857197689', 'The Psychology of Money', 'Morgan Housel', 'Harriman House', 2020, 8, 5, 4, 'B1'),
('BK-016', '978-1599869773', 'The Art of War', 'Sun Tzu', 'Unknown', -500, 9, 4, 3, 'B2'),
('BK-017', '978-8173711466', 'Wings of Fire', 'A.P.J. Abdul Kalam', 'Universities Press', 1999, 6, 3, 2, 'B3'),
('BK-018', '978-1982134488', 'Think Like a Monk', 'Jay Shetty', 'Simon & Schuster', 2020, 7, 4, 3, 'C1'),
('BK-019', '978-1612680194', 'Rich Dad Poor Dad', 'Robert Kiyosaki', 'Plata Publishing', 1997, 8, 6, 4, 'C2'),
('BK-020', '978-1250301696', 'The Silent Patient', 'Alex Michaelides', 'Celadon Books', 2019, 1, 4, 3, 'C3');

-- 3. Insert Members
INSERT INTO members (member_code, full_name, email, phone, address, membership_type, status, joined_at) VALUES
('MB-001', 'Ananya S.', 'ananya.s@mailbox.com', '+91 90000 10001', 'Coimbatore, TN', 'Standard', 'ACTIVE', CURRENT_DATE - INTERVAL '60 days'),
('MB-002', 'Rahul Kumar', 'rahul.kumar@mailbox.com', '+91 90000 10002', 'Chennai, TN', 'Premium', 'ACTIVE', CURRENT_DATE - INTERVAL '55 days'),
('MB-003', 'Alex Johnson', 'alex.johnson@mailbox.com', '+91 90000 10003', 'Bengaluru, KA', 'Standard', 'ACTIVE', CURRENT_DATE - INTERVAL '50 days'),
('MB-004', 'Priya Menon', 'priya.menon@mailbox.com', '+91 90000 10004', 'Kochi, KL', 'Standard', 'ACTIVE', CURRENT_DATE - INTERVAL '45 days'),
('MB-005', 'Karthik Raja', 'karthik.raja@mailbox.com', '+91 90000 10005', 'Madurai, TN', 'Premium', 'ACTIVE', CURRENT_DATE - INTERVAL '40 days'),
('MB-006', 'Sneha Iyer', 'sneha.iyer@mailbox.com', '+91 90000 10006', 'Coimbatore, TN', 'Standard', 'ACTIVE', CURRENT_DATE - INTERVAL '35 days'),
('MB-007', 'Vikram Rao', 'vikram.rao@mailbox.com', '+91 90000 10007', 'Hyderabad, TS', 'Standard', 'ACTIVE', CURRENT_DATE - INTERVAL '30 days'),
('MB-008', 'Divya Nair', 'divya.nair@mailbox.com', '+91 90000 10008', 'Trivandrum, KL', 'Premium', 'ACTIVE', CURRENT_DATE - INTERVAL '25 days'),
('MB-009', 'Arjun Pillai', 'arjun.pillai@mailbox.com', '+91 90000 10009', 'Mysuru, KA', 'Standard', 'ACTIVE', CURRENT_DATE - INTERVAL '20 days'),
('MB-010', 'Farhan Sheikh', 'farhan.sheikh@mailbox.com', '+91 90000 10011', 'Bengaluru, KA', 'Standard', 'BLOCKED', CURRENT_DATE - INTERVAL '10 days');

-- 4. Insert Circulation Loans
INSERT INTO loans (loan_code, book_id, member_id, issue_date, due_date, return_date, status, fine_amount) VALUES
('LN-001', 1, 1, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '4 days', NULL, 'ACTIVE', 0.00),
('LN-002', 2, 2, CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '4 days', NULL, 'OVERDUE', 20.00),
('LN-003', 3, 3, CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE, NULL, 'DUE_TODAY', 0.00),
('LN-004', 6, 4, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '6 days', NULL, 'OVERDUE', 30.00),
('LN-005', 7, 5, CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE + INTERVAL '7 days', NULL, 'ACTIVE', 0.00),
('LN-006', 8, 6, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '9 days', NULL, 'ACTIVE', 0.00),
('LN-007', 9, 7, CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE + INTERVAL '2 days', NULL, 'ACTIVE', 0.00),
('LN-008', 4, 8, CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE - INTERVAL '11 days', CURRENT_DATE - INTERVAL '12 days', 'RETURNED', 0.00);

-- 5. Insert Hold Queue Reservations
INSERT INTO reservations (reservation_code, book_id, member_id, reservation_date, queue_position, status) VALUES
('RS-001', 1, 3, CURRENT_DATE - INTERVAL '3 days', 1, 'WAITING'),
('RS-002', 6, 2, CURRENT_DATE - INTERVAL '2 days', 1, 'READY'),
('RS-003', 8, 4, CURRENT_DATE - INTERVAL '1 days', 1, 'WAITING');
