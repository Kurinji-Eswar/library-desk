-- =============================================================================
-- Migration V1: Initial Schema for LIBRARY / DESK
-- Normalized Relational Database Design with Foreign Keys and Constraints
-- =============================================================================

-- 1. Categories Table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_categories_name ON categories(name);

-- 2. Books Table
CREATE TABLE books (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    isbn VARCHAR(32) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    publication_year INT NOT NULL,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    total_copies INT NOT NULL CHECK (total_copies >= 0),
    available_copies INT NOT NULL CHECK (available_copies >= 0 AND available_copies <= total_copies),
    shelf_location VARCHAR(64) DEFAULT 'A1',
    description TEXT,
    version BIGINT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_category_id ON books(category_id);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);

-- 3. Members Table
CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    member_code VARCHAR(32) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(64),
    address TEXT,
    membership_type VARCHAR(32) DEFAULT 'Standard' NOT NULL,
    status VARCHAR(32) DEFAULT 'ACTIVE' NOT NULL,
    joined_at DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_member_status CHECK (status IN ('ACTIVE', 'BLOCKED')),
    CONSTRAINT chk_member_type CHECK (membership_type IN ('Standard', 'Premium'))
);

CREATE INDEX idx_members_code ON members(member_code);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_status ON members(status);

-- 4. Loans Table (Circulation)
CREATE TABLE loans (
    id BIGSERIAL PRIMARY KEY,
    loan_code VARCHAR(32) NOT NULL UNIQUE,
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(32) DEFAULT 'ACTIVE' NOT NULL,
    fine_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_loan_status CHECK (status IN ('ACTIVE', 'DUE TODAY', 'DUE_TODAY', 'OVERDUE', 'RETURNED')),
    CONSTRAINT chk_loan_dates CHECK (due_date >= issue_date)
);

CREATE INDEX idx_loans_book_id ON loans(book_id);
CREATE INDEX idx_loans_member_id ON loans(member_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_due_date ON loans(due_date);

-- 5. Reservations Table (Holds Queue)
CREATE TABLE reservations (
    id BIGSERIAL PRIMARY KEY,
    reservation_code VARCHAR(32) NOT NULL UNIQUE,
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
    reservation_date DATE NOT NULL,
    queue_position INT DEFAULT 1 NOT NULL,
    status VARCHAR(32) DEFAULT 'WAITING' NOT NULL,
    fulfilled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_reservation_status CHECK (status IN ('WAITING', 'READY', 'FULFILLED', 'CANCELLED'))
);

CREATE INDEX idx_reservations_book_id ON reservations(book_id);
CREATE INDEX idx_reservations_member_id ON reservations(member_id);
CREATE INDEX idx_reservations_status ON reservations(status);
