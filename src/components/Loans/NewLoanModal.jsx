import { useState } from 'react';
import Modal from '../UI/Modal.jsx';
import Button from '../UI/Button.jsx';
import Select from '../UI/Select.jsx';
import Input, { Field } from '../UI/Input.jsx';
import Icon from '../icons/Icon.jsx';
import { addDays, daysBetween, isoDate, todayISO } from '../../utils/dateUtils.js';
import { useLibrary } from '../../context/LibraryContext.jsx';

function NewLoanModal({ preset, onClose }) {
  const { books, members, createLoan, pushToast } = useLibrary();
  const [form, setForm] = useState({
    memberId: preset?.memberId || '',
    bookId: preset?.bookId || '',
    borrowedDate: todayISO(),
    dueDate: isoDate(addDays(new Date(), 14)),
  });

  const selectedBook = books.find((b) => b.id === form.bookId);
  const duration = daysBetween(form.borrowedDate, form.dueDate);

  const submit = () => {
    if (!form.memberId || !form.bookId) {
      pushToast('MISSING INFO', 'Select a member and a book.', 'error');
      return;
    }
    const ok = createLoan(form);
    if (ok) onClose();
  };

  return (
    <Modal open title="NEW LOAN" onClose={onClose}>
      <Field label="Select Member" required>
        <Select value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })}>
          <option value="">— Choose a member —</option>
          {members.map((m) => (
            <option key={m.id} value={m.id} disabled={m.status === 'BLOCKED'}>
              {m.name} {m.status === 'BLOCKED' ? '(BLOCKED)' : ''}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Select Book" required>
        <Select value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })}>
          <option value="">— Choose a book —</option>
          {books.map((b) => (
            <option key={b.id} value={b.id} disabled={b.availableCopies < 1}>
              {b.title} {b.availableCopies < 1 ? '(UNAVAILABLE)' : `(${b.availableCopies} avail.)`}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Borrow Date">
          <Input type="date" value={form.borrowedDate} onChange={(e) => setForm({ ...form, borrowedDate: e.target.value })} />
        </Field>
        <Field label="Due Date">
          <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        </Field>
      </div>
      <div className="text-xs font-mono text-grayish mb-2">
        Loan duration: {duration} days {selectedBook && `· Available copies: ${selectedBook.availableCopies}`}
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t-2 border-ink">
        <Button variant="ghost" onClick={onClose}>
          CANCEL
        </Button>
        <Button variant="primary" onClick={submit}>
          <Icon name="check" className="w-3.5 h-3.5" />
          CREATE LOAN
        </Button>
      </div>
    </Modal>
  );
}

export default NewLoanModal;
