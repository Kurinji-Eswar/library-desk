import { useState } from 'react';
import Modal from '../UI/Modal.jsx';
import Button from '../UI/Button.jsx';
import Select from '../UI/Select.jsx';
import { Field } from '../UI/Input.jsx';
import Icon from '../icons/Icon.jsx';
import { useLibrary } from '../../context/LibraryContext.jsx';

function NewReservationModal({ preset, onClose }) {
  const { books, members, createReservation, pushToast } = useLibrary();
  const [form, setForm] = useState({ bookId: preset?.bookId || '', memberId: '' });

  const submit = () => {
    if (!form.bookId || !form.memberId) {
      pushToast('MISSING INFO', 'Select a member and a book.', 'error');
      return;
    }
    createReservation(form);
    onClose();
  };

  return (
    <Modal open title="NEW RESERVATION" onClose={onClose}>
      <Field label="Select Book" required>
        <Select value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })}>
          <option value="">— Choose a book —</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Select Member" required>
        <Select value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })}>
          <option value="">— Choose a member —</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </Select>
      </Field>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t-2 border-ink">
        <Button variant="ghost" onClick={onClose}>
          CANCEL
        </Button>
        <Button variant="primary" onClick={submit}>
          <Icon name="check" className="w-3.5 h-3.5" />
          RESERVE BOOK
        </Button>
      </div>
    </Modal>
  );
}

export default NewReservationModal;
