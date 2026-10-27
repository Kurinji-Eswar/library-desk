import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildSeedDataset } from '../data/seedData.js';
import { LS_KEYS, SCHEMA_VERSION, persist, uid } from '../utils/libraryUtils.js';
import { addDays, daysBetween, isoDate, todayISO } from '../utils/dateUtils.js';
import { booksApi } from '../api/books.js';
import { membersApi } from '../api/members.js';
import { loansApi } from '../api/loans.js';
import { reservationsApi } from '../api/reservations.js';
import { categoriesApi } from '../api/categories.js';
import { migrationApi } from '../api/migration.js';

function loadOrSeed() {
  try {
    const v = localStorage.getItem(LS_KEYS.version);
    if (v && parseInt(v, 10) === SCHEMA_VERSION && localStorage.getItem(LS_KEYS.books)) {
      return {
        categories: JSON.parse(localStorage.getItem(LS_KEYS.categories) || '[]'),
        books: JSON.parse(localStorage.getItem(LS_KEYS.books) || '[]'),
        members: JSON.parse(localStorage.getItem(LS_KEYS.members) || '[]'),
        loans: JSON.parse(localStorage.getItem(LS_KEYS.loans) || '[]'),
        reservations: JSON.parse(localStorage.getItem(LS_KEYS.reservations) || '[]'),
      };
    }
  } catch (e) {
    // fall through to seed
  }
  const seeded = buildSeedDataset();
  try {
    localStorage.setItem(LS_KEYS.version, String(SCHEMA_VERSION));
    localStorage.setItem(LS_KEYS.categories, JSON.stringify(seeded.categories));
    localStorage.setItem(LS_KEYS.books, JSON.stringify(seeded.books));
    localStorage.setItem(LS_KEYS.members, JSON.stringify(seeded.members));
    localStorage.setItem(LS_KEYS.loans, JSON.stringify(seeded.loans));
    localStorage.setItem(LS_KEYS.reservations, JSON.stringify(seeded.reservations));
  } catch (e) {
    // storage unavailable
  }
  return seeded;
}

/**
 * Central application store integrated with the Spring Boot REST API & PostgreSQL backend.
 * Provides optimistic UI feedback, live synchronization, server validation handling,
 * and seamless fallback/migration.
 */
export function useLibraryStore() {
  const initial = useMemo(loadOrSeed, []);
  const [books, setBooks] = useState(initial.books);
  const [members, setMembers] = useState(initial.members);
  const [loans, setLoans] = useState(initial.loans);
  const [reservations, setReservations] = useState(initial.reservations);
  const [categories, setCategories] = useState(initial.categories);

  const [backendConnected, setBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [view, setView] = useState('desktop');
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [modal, setModal] = useState(null); // { type, payload }
  const [confirm, setConfirm] = useState(null); // { title, body, onConfirm, danger }
  const [toasts, setToasts] = useState([]);
  const [now, setNow] = useState(new Date());
  const [activity, setActivity] = useState([
    { id: uid('AC'), type: 'SYSTEM', text: 'Library OS initialized.', at: new Date().toISOString() },
  ]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const pushToast = useCallback((title, body, tone = 'default') => {
    const id = uid('TS');
    setToasts((ts) => [...ts, { id, title, body, tone }]);
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const logActivity = useCallback((type, text) => {
    setActivity((a) => [{ id: uid('AC'), type, text, at: new Date().toISOString() }, ...a].slice(0, 30));
  }, []);

  // Synchronize state from Spring Boot Backend
  const refreshFromBackend = useCallback(async () => {
    try {
      const [bks, mbrs, lns, rsvs, cats] = await Promise.all([
        booksApi.getAll(),
        membersApi.getAll(),
        loansApi.getAll(),
        reservationsApi.getAll(),
        categoriesApi.getAll(),
      ]);

      setBooks(bks);
      setMembers(mbrs);
      setLoans(lns);
      setReservations(rsvs);
      setCategories(cats);
      setBackendConnected(true);

      // Cache snapshot for offline resilience
      persist(LS_KEYS.books, bks);
      persist(LS_KEYS.members, mbrs);
      persist(LS_KEYS.loans, lns);
      persist(LS_KEYS.reservations, rsvs);
      persist(LS_KEYS.categories, cats);
    } catch (err) {
      console.warn('Backend currently offline or unreachable:', err.message);
      setBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  // Recompute live loan statuses
  const liveLoans = useMemo(() => {
    return loans.map((l) => {
      if (l.status === 'RETURNED') return l;
      const diff = daysBetween(l.dueDate, todayISO());
      let status = 'ACTIVE';
      let fine = 0;
      if (diff > 0) {
        status = 'OVERDUE';
        fine = diff * 5;
      } else if (diff === 0) {
        status = 'DUE TODAY';
      }
      return { ...l, status, fine };
    });
  }, [loans]);

  const bookById = useCallback((id) => books.find((b) => b.id === id || b.code === id), [books]);
  const memberById = useCallback((id) => members.find((m) => m.id === id || m.memberCode === id), [members]);

  const navigate = useCallback((key) => {
    setView(key);
    setSelectedBookId(null);
    setSelectedMemberId(null);
  }, []);

  /* ---------- BOOK ACTIONS ---------- */

  const addBook = useCallback(
    async (data) => {
      try {
        await booksApi.create({
          title: data.title,
          author: data.author,
          isbn: data.isbn,
          category: data.category,
          publisher: data.publisher,
          year: Number(data.year),
          totalCopies: Number(data.totalCopies),
          shelf: data.shelf || 'A1',
          description: data.description || '',
        });
        await refreshFromBackend();
        pushToast('BOOK ADDED', `"${data.title}" saved to PostgreSQL catalog.`, 'success');
        logActivity('BOOK ADDED', `"${data.title}"`);
        return true;
      } catch (err) {
        pushToast('FAILED TO ADD BOOK', err.message || 'Server error occurred', 'error');
        return false;
      }
    },
    [refreshFromBackend, pushToast, logActivity]
  );

  const editBook = useCallback(
    async (id, data) => {
      try {
        await booksApi.update(id, {
          title: data.title,
          author: data.author,
          isbn: data.isbn,
          category: data.category,
          publisher: data.publisher,
          year: Number(data.year),
          totalCopies: Number(data.totalCopies),
          shelf: data.shelf,
          description: data.description,
        });
        await refreshFromBackend();
        pushToast('BOOK UPDATED', `"${data.title}" updated in database.`, 'success');
        return true;
      } catch (err) {
        pushToast('UPDATE FAILED', err.message, 'error');
        return false;
      }
    },
    [refreshFromBackend, pushToast]
  );

  const deleteBook = useCallback(
    async (id) => {
      const book = bookById(id);
      try {
        await booksApi.delete(id);
        await refreshFromBackend();
        pushToast('BOOK REMOVED', `"${book?.title || id}" removed from database.`, 'default');
        setSelectedBookId((current) => (current === id ? null : current));
      } catch (err) {
        pushToast('ACTION BLOCKED', err.message, 'error');
      }
    },
    [bookById, refreshFromBackend, pushToast]
  );

  /* ---------- MEMBER ACTIONS ---------- */

  const addMember = useCallback(
    async (data) => {
      try {
        await membersApi.create({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          address: data.address || '',
          membershipType: data.membershipType || 'Standard',
        });
        await refreshFromBackend();
        pushToast('MEMBER ADDED', `"${data.name}" registered in database.`, 'success');
        logActivity('NEW MEMBER', `"${data.name}"`);
        return true;
      } catch (err) {
        pushToast('REGISTRATION FAILED', err.message, 'error');
        return false;
      }
    },
    [refreshFromBackend, pushToast, logActivity]
  );

  const editMember = useCallback(
    async (id, data) => {
      try {
        await membersApi.update(id, {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          membershipType: data.membershipType,
        });
        await refreshFromBackend();
        pushToast('MEMBER UPDATED', `"${data.name}" updated in database.`, 'success');
        return true;
      } catch (err) {
        pushToast('UPDATE FAILED', err.message, 'error');
        return false;
      }
    },
    [refreshFromBackend, pushToast]
  );

  const toggleBlockMember = useCallback(
    async (id) => {
      try {
        const updated = await membersApi.toggleStatus(id);
        await refreshFromBackend();
        pushToast(
          updated.status === 'BLOCKED' ? 'MEMBER BLOCKED' : 'MEMBER UNBLOCKED',
          `"${updated.name}" status changed to ${updated.status}.`,
          'default'
        );
      } catch (err) {
        pushToast('STATUS CHANGE FAILED', err.message, 'error');
      }
    },
    [refreshFromBackend, pushToast]
  );

  const deleteMember = useCallback(
    async (id) => {
      const m = memberById(id);
      try {
        await membersApi.delete(id);
        await refreshFromBackend();
        pushToast('MEMBER REMOVED', `"${m?.name || id}" removed from database.`, 'default');
        setSelectedMemberId((current) => (current === id ? null : current));
      } catch (err) {
        pushToast('ACTION BLOCKED', err.message, 'error');
      }
    },
    [memberById, refreshFromBackend, pushToast]
  );

  /* ---------- LOAN ACTIONS ---------- */

  const createLoan = useCallback(
    async (data) => {
      try {
        const loan = await loansApi.issue({
          bookId: data.bookId,
          memberId: data.memberId,
          borrowedDate: data.borrowedDate,
          dueDate: data.dueDate,
        });
        await refreshFromBackend();
        pushToast('LOAN CREATED', `Loan ${loan.id} recorded in PostgreSQL.`, 'success');
        logActivity('BOOK BORROWED', `"${loan.bookTitle}" by ${loan.memberName}`);
        return true;
      } catch (err) {
        pushToast('LOAN FAILED', err.message, 'error');
        return false;
      }
    },
    [refreshFromBackend, pushToast, logActivity]
  );

  const processReturn = useCallback(
    async (loanId, waiveFine = false) => {
      try {
        const loan = await loansApi.returnLoan(loanId, waiveFine, todayISO());
        await refreshFromBackend();
        pushToast('RETURN PROCESSED', `"${loan.bookTitle}" return recorded in database.`, 'success');
        logActivity('BOOK RETURNED', `"${loan.bookTitle}" by ${loan.memberName}`);
      } catch (err) {
        pushToast('RETURN FAILED', err.message, 'error');
      }
    },
    [refreshFromBackend, pushToast, logActivity]
  );

  /* ---------- RESERVATION ACTIONS ---------- */

  const createReservation = useCallback(
    async (data) => {
      try {
        await reservationsApi.create({
          bookId: data.bookId,
          memberId: data.memberId,
          requestedDate: todayISO(),
        });
        await refreshFromBackend();
        pushToast('RESERVATION CREATED', 'Hold placed in queue.', 'success');
        return true;
      } catch (err) {
        pushToast('RESERVATION FAILED', err.message, 'error');
        return false;
      }
    },
    [refreshFromBackend, pushToast]
  );

  const cancelReservation = useCallback(
    async (id) => {
      try {
        await reservationsApi.cancel(id);
        await refreshFromBackend();
        pushToast('RESERVATION CANCELLED', 'Hold removed from active queue.', 'default');
      } catch (err) {
        pushToast('CANCEL FAILED', err.message, 'error');
      }
    },
    [refreshFromBackend, pushToast]
  );

  const markReady = useCallback(
    async (id) => {
      try {
        await reservationsApi.markReady(id);
        await refreshFromBackend();
        pushToast('RESERVATION READY', 'Hold marked ready for collection.', 'success');
      } catch (err) {
        pushToast('ACTION FAILED', err.message, 'error');
      }
    },
    [refreshFromBackend, pushToast]
  );

  const fulfillReservation = useCallback(
    async (id) => {
      try {
        await reservationsApi.fulfill(id);
        await refreshFromBackend();
        pushToast('RESERVATION FULFILLED', 'Hold converted into an active loan.', 'success');
      } catch (err) {
        pushToast('FULFILL FAILED', err.message, 'error');
      }
    },
    [refreshFromBackend, pushToast]
  );

  /* ---------- CATEGORY ACTIONS ---------- */

  const addCategory = useCallback(
    async (name) => {
      if (!name || !name.trim()) return;
      try {
        await categoriesApi.create(name.trim().toUpperCase());
        await refreshFromBackend();
        pushToast('CATEGORY ADDED', `"${name.trim().toUpperCase()}" created.`, 'success');
      } catch (err) {
        pushToast('CATEGORY FAILED', err.message, 'error');
      }
    },
    [refreshFromBackend, pushToast]
  );

  const editCategory = useCallback(
    async (id, name) => {
      if (!name || !name.trim()) return;
      try {
        await categoriesApi.update(id, name.trim().toUpperCase());
        await refreshFromBackend();
        pushToast('CATEGORY UPDATED', 'Category renamed in database.', 'success');
      } catch (err) {
        pushToast('UPDATE FAILED', err.message, 'error');
      }
    },
    [refreshFromBackend, pushToast]
  );

  const deleteCategory = useCallback(
    async (id) => {
      try {
        await categoriesApi.delete(id);
        await refreshFromBackend();
        pushToast('CATEGORY REMOVED', 'Category deleted from database.', 'default');
      } catch (err) {
        pushToast('ACTION BLOCKED', err.message, 'error');
      }
    },
    [refreshFromBackend, pushToast]
  );

  /* ---------- SYSTEM & DATA MIGRATION ACTIONS ---------- */

  const migrateLocalDataToBackend = useCallback(async () => {
    try {
      const payload = {
        categories: JSON.parse(localStorage.getItem(LS_KEYS.categories) || '[]'),
        books: JSON.parse(localStorage.getItem(LS_KEYS.books) || '[]'),
        members: JSON.parse(localStorage.getItem(LS_KEYS.members) || '[]'),
        loans: JSON.parse(localStorage.getItem(LS_KEYS.loans) || '[]'),
      };

      const result = await migrationApi.importLocalStorageData(payload);
      await refreshFromBackend();

      const summaryText = `Migrated: ${result.importedBooks} books, ${result.importedMembers} members, ${result.importedLoans} loans.`;
      pushToast('DATA MIGRATION SUCCESS', summaryText, 'success');
      return result;
    } catch (err) {
      pushToast('MIGRATION ERROR', err.message, 'error');
      throw err;
    }
  }, [refreshFromBackend, pushToast]);

  const resetDemoData = useCallback(() => {
    const seeded = buildSeedDataset();
    setCategories(seeded.categories);
    setBooks(seeded.books);
    setMembers(seeded.members);
    setLoans(seeded.loans);
    setReservations(seeded.reservations);
    pushToast('DEMO DATA RESET', 'Local preview data restored.', 'success');
    setConfirm(null);
    navigate('desktop');
  }, [pushToast, navigate]);

  const exportData = useCallback(() => {
    const payload = {
      books,
      members,
      loans,
      reservations,
      categories,
      exportedAt: new Date().toISOString(),
      schemaVersion: SCHEMA_VERSION,
      source: 'Spring Boot REST + PostgreSQL Live Store',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'library-desk-database-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    pushToast('DATA EXPORTED', 'JSON backup file downloaded.', 'success');
  }, [books, members, loans, reservations, categories, pushToast]);

  /* ---------- DERIVED STATS ---------- */

  const stats = useMemo(() => {
    const totalBooks = books.reduce((s, b) => s + (b.totalCopies || 0), 0);
    const available = books.reduce((s, b) => s + (b.availableCopies || 0), 0);
    const borrowed = totalBooks - available;
    const overdue = liveLoans.filter((l) => l.status === 'OVERDUE').length;
    const dueToday = liveLoans.filter((l) => l.status === 'DUE TODAY').length;
    const activeLoans = liveLoans.filter((l) => l.status !== 'RETURNED').length;
    return {
      totalBooks,
      available,
      borrowed,
      overdue,
      dueToday,
      activeLoans,
      totalMembers: members.length,
      backendConnected,
    };
  }, [books, liveLoans, members, backendConnected]);

  return {
    // domain data
    books,
    members,
    loans: liveLoans,
    reservations,
    categories,
    stats,
    activity,

    // system / connection state
    backendConnected,
    isLoading,
    refreshFromBackend,
    migrateLocalDataToBackend,

    // UI state
    view,
    selectedBookId,
    selectedMemberId,
    modal,
    confirm,
    toasts,
    now,

    // setters
    setView,
    setSelectedBookId,
    setSelectedMemberId,
    setModal,
    setConfirm,
    dismissToast,
    pushToast,
    navigate,

    // actions
    addBook,
    editBook,
    deleteBook,
    addMember,
    editMember,
    toggleBlockMember,
    deleteMember,
    createLoan,
    processReturn,
    createReservation,
    cancelReservation,
    markReady,
    fulfillReservation,
    addCategory,
    editCategory,
    deleteCategory,
    resetDemoData,
    exportData,

    // helpers
    bookById,
    memberById,
  };
}

export default useLibraryStore;
