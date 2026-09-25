import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildSeedDataset } from '../data/seedData.js';
import { LS_KEYS, SCHEMA_VERSION, persist, uid } from '../utils/libraryUtils.js';
import { addDays, daysBetween, isoDate, todayISO } from '../utils/dateUtils.js';

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
    // storage unavailable, continue with in-memory seed
  }
  return seeded;
}

/**
 * Central application store. Holds all domain data (books, members, loans,
 * reservations, categories), UI state (current view, selections, modals,
 * toasts, activity feed) and every action that mutates the data. Everything
 * is persisted to localStorage as it changes.
 */
export function useLibraryStore() {
  const initial = useMemo(loadOrSeed, []);
  const [books, setBooks] = useState(initial.books);
  const [members, setMembers] = useState(initial.members);
  const [loans, setLoans] = useState(initial.loans);
  const [reservations, setReservations] = useState(initial.reservations);
  const [categories, setCategories] = useState(initial.categories);

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

  useEffect(() => persist(LS_KEYS.books, books), [books]);
  useEffect(() => persist(LS_KEYS.members, members), [members]);
  useEffect(() => persist(LS_KEYS.loans, loans), [loans]);
  useEffect(() => persist(LS_KEYS.reservations, reservations), [reservations]);
  useEffect(() => persist(LS_KEYS.categories, categories), [categories]);

  const pushToast = useCallback((title, body, tone = 'default') => {
    const id = uid('TS');
    setToasts((ts) => [...ts, { id, title, body, tone }]);
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 4500);
  }, []);

  const logActivity = useCallback((type, text) => {
    setActivity((a) => [{ id: uid('AC'), type, text, at: new Date().toISOString() }, ...a].slice(0, 30));
  }, []);

  // Recompute loan statuses (active/due today/overdue) live based on today's
  // date, without mutating already-returned loans.
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

  const bookById = useCallback((id) => books.find((b) => b.id === id), [books]);
  const memberById = useCallback((id) => members.find((m) => m.id === id), [members]);

  const navigate = useCallback((key) => {
    setView(key);
    setSelectedBookId(null);
    setSelectedMemberId(null);
  }, []);

  /* ---------- BOOK ACTIONS ---------- */

  const addBook = useCallback(
    (data) => {
      const dup = books.some((b) => b.isbn === data.isbn);
      if (dup) {
        pushToast('DUPLICATE ISBN', 'A book with this ISBN already exists.', 'error');
        return false;
      }
      const book = {
        id: uid('BK'),
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        category: data.category,
        publisher: data.publisher,
        year: Number(data.year),
        totalCopies: Number(data.totalCopies),
        availableCopies: Number(data.totalCopies),
        shelf: data.shelf || 'A1',
        addedDate: todayISO(),
      };
      setBooks((bs) => [book, ...bs]);
      pushToast('BOOK ADDED', `"${data.title}" was added.`, 'success');
      logActivity('BOOK ADDED', `"${data.title}"`);
      return true;
    },
    [books, pushToast, logActivity]
  );

  const editBook = useCallback(
    (id, data) => {
      setBooks((bs) =>
        bs.map((b) => {
          if (b.id !== id) return b;
          const borrowed = b.totalCopies - b.availableCopies;
          const newTotal = Number(data.totalCopies);
          return {
            ...b,
            title: data.title,
            author: data.author,
            isbn: data.isbn,
            category: data.category,
            publisher: data.publisher,
            year: Number(data.year),
            shelf: data.shelf,
            totalCopies: newTotal,
            availableCopies: Math.max(0, newTotal - borrowed),
          };
        })
      );
      pushToast('BOOK UPDATED', `"${data.title}" was updated.`, 'success');
    },
    [pushToast]
  );

  const deleteBook = useCallback(
    (id) => {
      const hasActiveLoans = liveLoans.some((l) => l.bookId === id && l.status !== 'RETURNED');
      if (hasActiveLoans) {
        pushToast('ACTION BLOCKED', 'This book has active loans.', 'error');
        return;
      }
      const book = bookById(id);
      setBooks((bs) => bs.filter((b) => b.id !== id));
      setReservations((rs) => rs.filter((r) => r.bookId !== id));
      pushToast('BOOK REMOVED', `"${book?.title}" was removed.`, 'default');
      setSelectedBookId((current) => (current === id ? null : current));
    },
    [liveLoans, bookById, pushToast]
  );

  /* ---------- MEMBER ACTIONS ---------- */

  const addMember = useCallback(
    (data) => {
      const member = { id: uid('MB'), ...data, joinedDate: todayISO(), status: 'ACTIVE' };
      setMembers((ms) => [member, ...ms]);
      pushToast('MEMBER ADDED', `"${data.name}" was added.`, 'success');
      logActivity('NEW MEMBER', `"${data.name}"`);
      return true;
    },
    [pushToast, logActivity]
  );

  const editMember = useCallback(
    (id, data) => {
      setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, ...data } : m)));
      pushToast('MEMBER UPDATED', `"${data.name}" was updated.`, 'success');
    },
    [pushToast]
  );

  const toggleBlockMember = useCallback(
    (id) => {
      const m = memberById(id);
      setMembers((ms) => ms.map((x) => (x.id === id ? { ...x, status: x.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED' } : x)));
      pushToast(m?.status === 'BLOCKED' ? 'MEMBER UNBLOCKED' : 'MEMBER BLOCKED', `"${m?.name}" status changed.`, 'default');
    },
    [memberById, pushToast]
  );

  const deleteMember = useCallback(
    (id) => {
      const hasActiveLoans = liveLoans.some((l) => l.memberId === id && l.status !== 'RETURNED');
      if (hasActiveLoans) {
        pushToast('ACTION BLOCKED', 'This member has active loans.', 'error');
        return;
      }
      const m = memberById(id);
      setMembers((ms) => ms.filter((x) => x.id !== id));
      pushToast('MEMBER REMOVED', `"${m?.name}" was removed.`, 'default');
      setSelectedMemberId((current) => (current === id ? null : current));
    },
    [liveLoans, memberById, pushToast]
  );

  /* ---------- LOAN ACTIONS ---------- */

  const createLoan = useCallback(
    (data) => {
      const book = bookById(data.bookId);
      const member = memberById(data.memberId);
      if (!book || book.availableCopies < 1) {
        pushToast('BOOK UNAVAILABLE', 'All copies are currently checked out.', 'error');
        return false;
      }
      if (member?.status === 'BLOCKED') {
        pushToast('MEMBER BLOCKED', 'This member cannot borrow books.', 'error');
        return false;
      }
      const dup = liveLoans.some((l) => l.bookId === data.bookId && l.memberId === data.memberId && l.status !== 'RETURNED');
      if (dup) {
        pushToast('DUPLICATE LOAN', 'This member already has this book on loan.', 'error');
        return false;
      }
      const loan = {
        id: uid('LN'),
        bookId: data.bookId,
        memberId: data.memberId,
        borrowedDate: data.borrowedDate,
        dueDate: data.dueDate,
        returnedDate: null,
        status: 'ACTIVE',
        fine: 0,
      };
      setLoans((ls) => [loan, ...ls]);
      setBooks((bs) => bs.map((b) => (b.id === data.bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b)));
      pushToast('LOAN CREATED', `Loan ${loan.id} created.`, 'success');
      logActivity('BOOK BORROWED', `"${book.title}" by ${member.name}`);
      return true;
    },
    [bookById, memberById, liveLoans, pushToast, logActivity]
  );

  const processReturn = useCallback(
    (loanId, waiveFine) => {
      const loan = liveLoans.find((l) => l.id === loanId);
      if (!loan) return;
      const book = bookById(loan.bookId);
      const member = memberById(loan.memberId);
      setLoans((ls) =>
        ls.map((l) => (l.id === loanId ? { ...l, status: 'RETURNED', returnedDate: todayISO(), fine: waiveFine ? 0 : loan.fine } : l))
      );
      setBooks((bs) => bs.map((b) => (b.id === loan.bookId ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) } : b)));
      pushToast('RETURN PROCESSED', `"${book?.title}" returned successfully.`, 'success');
      logActivity('BOOK RETURNED', `"${book?.title}" by ${member?.name}`);

      const waitingRes = reservations.filter((r) => r.bookId === loan.bookId && (r.status === 'WAITING' || r.status === 'READY'));
      if (waitingRes.length > 0) {
        setReservations((rs) =>
          rs.map((r) => (r.bookId === loan.bookId && r.status === 'WAITING' && r.position === 1 ? { ...r, status: 'READY' } : r))
        );
        pushToast('RESERVATION READY', `A reserved copy of "${book?.title}" is now available.`, 'default');
      }
    },
    [liveLoans, bookById, memberById, reservations, pushToast, logActivity]
  );

  /* ---------- RESERVATION ACTIONS ---------- */

  const createReservation = useCallback(
    (data) => {
      const book = bookById(data.bookId);
      const waitCount = reservations.filter((r) => r.bookId === data.bookId && (r.status === 'WAITING' || r.status === 'READY')).length;
      const res = { id: uid('RS'), bookId: data.bookId, memberId: data.memberId, requestedDate: todayISO(), position: waitCount + 1, status: 'WAITING' };
      setReservations((rs) => [res, ...rs]);
      pushToast('RESERVATION CREATED', `"${book?.title}" reserved.`, 'success');
    },
    [bookById, reservations, pushToast]
  );

  const cancelReservation = useCallback((id) => {
    setReservations((rs) => rs.map((r) => (r.id === id ? { ...r, status: 'CANCELLED' } : r)));
  }, []);

  const markReady = useCallback((id) => {
    setReservations((rs) => rs.map((r) => (r.id === id ? { ...r, status: 'READY' } : r)));
  }, []);

  const fulfillReservation = useCallback(
    (id) => {
      const res = reservations.find((r) => r.id === id);
      if (!res) return;
      const ok = createLoan({ bookId: res.bookId, memberId: res.memberId, borrowedDate: todayISO(), dueDate: isoDate(addDays(new Date(), 14)) });
      if (ok) setReservations((rs) => rs.map((r) => (r.id === id ? { ...r, status: 'FULFILLED' } : r)));
    },
    [reservations, createLoan]
  );

  /* ---------- CATEGORY ACTIONS ---------- */

  const addCategory = useCallback(
    (name) => {
      if (!name.trim()) return;
      if (categories.some((c) => c.name.toUpperCase() === name.trim().toUpperCase())) {
        pushToast('DUPLICATE CATEGORY', 'This category already exists.', 'error');
        return;
      }
      setCategories((cs) => [...cs, { id: uid('CAT'), name: name.trim().toUpperCase() }]);
      pushToast('CATEGORY ADDED', `"${name.trim().toUpperCase()}" was added.`, 'success');
    },
    [categories, pushToast]
  );

  const editCategory = useCallback(
    (id, name) => {
      const old = categories.find((c) => c.id === id);
      const newName = name.trim().toUpperCase();
      setCategories((cs) => cs.map((c) => (c.id === id ? { ...c, name: newName } : c)));
      setBooks((bs) => bs.map((b) => (b.category === old?.name ? { ...b, category: newName } : b)));
      pushToast('CATEGORY UPDATED', 'Category renamed.', 'success');
    },
    [categories, pushToast]
  );

  const deleteCategory = useCallback(
    (id) => {
      const cat = categories.find((c) => c.id === id);
      const inUse = books.some((b) => b.category === cat?.name);
      if (inUse) {
        pushToast('CATEGORY IN USE', 'Reassign books before deleting this category.', 'error');
        return;
      }
      setCategories((cs) => cs.filter((c) => c.id !== id));
      pushToast('CATEGORY REMOVED', `"${cat?.name}" removed.`, 'default');
    },
    [categories, books, pushToast]
  );

  /* ---------- SYSTEM ACTIONS ---------- */

  const resetDemoData = useCallback(() => {
    const seeded = buildSeedDataset();
    setCategories(seeded.categories);
    setBooks(seeded.books);
    setMembers(seeded.members);
    setLoans(seeded.loans);
    setReservations(seeded.reservations);
    pushToast('DEMO DATA RESET', 'All data restored to defaults.', 'success');
    setConfirm(null);
    navigate('desktop');
  }, [pushToast, navigate]);

  const exportData = useCallback(() => {
    const payload = { books, members, loans, reservations, categories, exportedAt: new Date().toISOString(), schemaVersion: SCHEMA_VERSION };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'library-desk-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    pushToast('DATA EXPORTED', 'JSON file downloaded.', 'success');
  }, [books, members, loans, reservations, categories, pushToast]);

  /* ---------- DERIVED STATS ---------- */

  const stats = useMemo(() => {
    const totalBooks = books.reduce((s, b) => s + b.totalCopies, 0);
    const available = books.reduce((s, b) => s + b.availableCopies, 0);
    const borrowed = totalBooks - available;
    const overdue = liveLoans.filter((l) => l.status === 'OVERDUE').length;
    const dueToday = liveLoans.filter((l) => l.status === 'DUE TODAY').length;
    const activeLoans = liveLoans.filter((l) => l.status !== 'RETURNED').length;
    return { totalBooks, available, borrowed, overdue, dueToday, activeLoans, totalMembers: members.length };
  }, [books, liveLoans, members]);

  return {
    // domain data
    books,
    members,
    loans: liveLoans,
    reservations,
    categories,
    stats,
    activity,
    now,
    bookById,
    memberById,
    // ui state
    view,
    selectedBookId,
    selectedMemberId,
    modal,
    confirm,
    toasts,
    // ui setters
    setModal,
    setConfirm,
    setSelectedBookId,
    setSelectedMemberId,
    navigate,
    pushToast,
    dismissToast: (id) => setToasts((ts) => ts.filter((t) => t.id !== id)),
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
  };
}

export default useLibraryStore;
