import { uid } from '../utils/libraryUtils.js';
import { isoDate, addDays, daysBetween } from '../utils/dateUtils.js';

export const CATEGORY_NAMES = [
  'FICTION',
  'NON-FICTION',
  'SCIENCE',
  'TECHNOLOGY',
  'HISTORY',
  'BIOGRAPHY',
  'SELF HELP',
  'BUSINESS',
  'PHILOSOPHY',
  'CHILDREN',
  'REFERENCE',
];

export function seedCategories() {
  return CATEGORY_NAMES.map((name) => ({ id: uid('CAT'), name }));
}

const BOOK_SEED = [
  ['The Great Gatsby', 'F. Scott Fitzgerald', 'FICTION', 1925, 'Scribner', 4],
  ['To Kill a Mockingbird', 'Harper Lee', 'FICTION', 1960, 'J. B. Lippincott & Co.', 3],
  ['1984', 'George Orwell', 'FICTION', 1949, 'Secker & Warburg', 5],
  ['Pride and Prejudice', 'Jane Austen', 'FICTION', 1813, 'T. Egerton', 3],
  ['The Hobbit', 'J.R.R. Tolkien', 'FICTION', 1937, 'George Allen & Unwin', 4],
  ['Clean Code', 'Robert C. Martin', 'TECHNOLOGY', 2008, 'Prentice Hall', 6],
  ['The Pragmatic Programmer', 'Andrew Hunt', 'TECHNOLOGY', 1999, 'Addison-Wesley', 5],
  ['Atomic Habits', 'James Clear', 'SELF HELP', 2018, 'Avery', 7],
  ['Sapiens', 'Yuval Noah Harari', 'NON-FICTION', 2011, 'Harvill Secker', 6],
  ['A Brief History of Time', 'Stephen Hawking', 'SCIENCE', 1988, 'Bantam Books', 4],
  ['The Alchemist', 'Paulo Coelho', 'FICTION', 1988, 'HarperTorch', 5],
  ['Deep Work', 'Cal Newport', 'SELF HELP', 2016, 'Grand Central', 3],
  ['Ikigai', 'Hector Garcia', 'SELF HELP', 2016, 'Penguin', 4],
  ['Steve Jobs', 'Walter Isaacson', 'BIOGRAPHY', 2011, 'Simon & Schuster', 3],
  ['The Psychology of Money', 'Morgan Housel', 'BUSINESS', 2020, 'Harriman House', 5],
  ['The Art of War', 'Sun Tzu', 'PHILOSOPHY', -500, 'Unknown', 4],
  ['Wings of Fire', 'A.P.J. Abdul Kalam', 'BIOGRAPHY', 1999, 'Universities Press', 3],
  ['Think Like a Monk', 'Jay Shetty', 'SELF HELP', 2020, 'Simon & Schuster', 4],
  ['Rich Dad Poor Dad', 'Robert Kiyosaki', 'BUSINESS', 1997, 'Plata Publishing', 6],
  ['The Silent Patient', 'Alex Michaelides', 'FICTION', 2019, 'Celadon Books', 4],
  ['Brief Answers to the Big Questions', 'Stephen Hawking', 'SCIENCE', 2018, 'John Murray', 3],
  ["Charlotte's Web", 'E.B. White', 'CHILDREN', 1952, 'Harper & Brothers', 5],
  ['The Little Prince', 'Antoine de Saint-Exupéry', 'CHILDREN', 1943, 'Reynal & Hitchcock', 4],
  ['Guns, Germs, and Steel', 'Jared Diamond', 'HISTORY', 1997, 'W. W. Norton', 3],
  ['The Oxford Dictionary of English', 'Oxford', 'REFERENCE', 2010, 'Oxford University Press', 2],
];

const SHELVES = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2'];

export function seedBooks() {
  return BOOK_SEED.map(([title, author, category, year, publisher, totalCopies], i) => {
    const borrowed = Math.min(totalCopies - 1, i % 3);
    return {
      id: uid('BK'),
      title,
      author,
      category,
      isbn: `978-${(1000000000 + i * 137).toString().slice(0, 9)}`,
      publisher,
      year,
      totalCopies,
      availableCopies: totalCopies - borrowed,
      shelf: SHELVES[i % SHELVES.length],
      addedDate: isoDate(addDays(new Date(), -(30 + i * 4))),
    };
  });
}

const MEMBER_SEED = [
  ['Ananya S.', 'ananya.s@mailbox.com', '+91 90000 10001', 'Coimbatore, TN', 'Standard'],
  ['Rahul Kumar', 'rahul.kumar@mailbox.com', '+91 90000 10002', 'Chennai, TN', 'Premium'],
  ['Alex Johnson', 'alex.johnson@mailbox.com', '+91 90000 10003', 'Bengaluru, KA', 'Standard'],
  ['Priya Menon', 'priya.menon@mailbox.com', '+91 90000 10004', 'Kochi, KL', 'Standard'],
  ['Karthik Raja', 'karthik.raja@mailbox.com', '+91 90000 10005', 'Madurai, TN', 'Premium'],
  ['Sneha Iyer', 'sneha.iyer@mailbox.com', '+91 90000 10006', 'Coimbatore, TN', 'Standard'],
  ['Vikram Rao', 'vikram.rao@mailbox.com', '+91 90000 10007', 'Hyderabad, TS', 'Standard'],
  ['Divya Nair', 'divya.nair@mailbox.com', '+91 90000 10008', 'Trivandrum, KL', 'Premium'],
  ['Arjun Pillai', 'arjun.pillai@mailbox.com', '+91 90000 10009', 'Mysuru, KA', 'Standard'],
  ['Meera Krishnan', 'meera.krishnan@mailbox.com', '+91 90000 10010', 'Coimbatore, TN', 'Standard'],
  ['Farhan Sheikh', 'farhan.sheikh@mailbox.com', '+91 90000 10011', 'Bengaluru, KA', 'Standard'],
  ['Lakshmi Prasad', 'lakshmi.prasad@mailbox.com', '+91 90000 10012', 'Chennai, TN', 'Premium'],
];

export function seedMembers() {
  return MEMBER_SEED.map(([name, email, phone, address, membershipType], i) => ({
    id: uid('MB'),
    name,
    email,
    phone,
    address,
    membershipType,
    joinedDate: isoDate(addDays(new Date(), -(60 + i * 11))),
    status: i === MEMBER_SEED.length - 1 ? 'BLOCKED' : 'ACTIVE',
  }));
}

export function seedLoansReservations(books, members) {
  const loans = [];
  const reservations = [];
  const activeLoanTargets = 10;
  let bIdx = 0;
  for (let i = 0; i < activeLoanTargets; i++) {
    const book = books[bIdx % books.length];
    const member = members[i % members.length];
    bIdx++;
    const borrowedOffset = (i % 5) + 1;
    const borrowedDate = addDays(new Date(), -(borrowedOffset * 3));
    const dueDate = addDays(borrowedDate, 14);
    const returned = i % 6 === 0;
    let status = 'ACTIVE';
    let returnedDate = null;
    let fine = 0;
    const dueDiff = daysBetween(dueDate, new Date());
    if (returned) {
      status = 'RETURNED';
      returnedDate = isoDate(addDays(dueDate, -1));
    } else if (dueDiff > 0) {
      status = 'OVERDUE';
      fine = dueDiff * 5;
    } else if (dueDiff === 0) {
      status = 'DUE TODAY';
    }
    loans.push({
      id: uid('LN'),
      bookId: book.id,
      memberId: member.id,
      borrowedDate: isoDate(borrowedDate),
      dueDate: isoDate(dueDate),
      returnedDate,
      status,
      fine,
    });
  }
  // Reservations for a handful of books, to seed the hold queue.
  const resTargets = books.slice(0, 5);
  resTargets.forEach((book, i) => {
    reservations.push({
      id: uid('RS'),
      bookId: book.id,
      memberId: members[(i + 3) % members.length].id,
      requestedDate: isoDate(addDays(new Date(), -(i + 1))),
      position: 1,
      status: i === 0 ? 'READY' : 'WAITING',
    });
  });
  return { loans, reservations };
}

export function buildSeedDataset() {
  const categories = seedCategories();
  const books = seedBooks();
  const members = seedMembers();
  const { loans, reservations } = seedLoansReservations(books, members);
  return { categories, books, members, loans, reservations };
}
