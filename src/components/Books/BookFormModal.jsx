import { useState } from 'react';
import Modal from '../UI/Modal.jsx';
import Button from '../UI/Button.jsx';
import Select from '../UI/Select.jsx';
import Input, { Field } from '../UI/Input.jsx';
import Icon from '../icons/Icon.jsx';
import { useLibrary } from '../../context/LibraryContext.jsx';

function BookFormModal({ book, onClose }) {
  const { addBook, editBook, categories } = useLibrary();
  const [form, setForm] = useState(
    book
      ? {
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          category: book.category,
          publisher: book.publisher,
          year: book.year,
          totalCopies: book.totalCopies,
          shelf: book.shelf,
        }
      : {
          title: '',
          author: '',
          isbn: '',
          category: categories[0]?.name || '',
          publisher: '',
          year: new Date().getFullYear(),
          totalCopies: 1,
          shelf: 'A1',
        }
  );
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.author.trim()) e.author = 'Author is required.';
    if (!form.category) e.category = 'Category is required.';
    if (!form.year || form.year < 0 || form.year > new Date().getFullYear() + 1) e.year = 'Enter a valid year.';
    if (!form.totalCopies || Number(form.totalCopies) < 1) e.totalCopies = 'Must be at least 1.';
    if (!/^[0-9-]{6,17}$/.test(form.isbn.trim())) e.isbn = 'Enter a valid ISBN (digits and dashes).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const ok = book ? (editBook(book.id, form), true) : addBook(form);
    if (ok) onClose();
  };

  return (
    <Modal open title={book ? `EDIT BOOK — ${book.id}` : 'ADD BOOK'} onClose={onClose} wide>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <Field label="Book Title" required>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          {errors.title && <p className="text-amber text-xs mt-1">{errors.title}</p>}
        </Field>
        <Field label="Author" required>
          <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          {errors.author && <p className="text-amber text-xs mt-1">{errors.author}</p>}
        </Field>
        <Field label="ISBN" required>
          <Input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} placeholder="978-0000000000" />
          {errors.isbn && <p className="text-amber text-xs mt-1">{errors.isbn}</p>}
        </Field>
        <Field label="Category" required>
          <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>
          {errors.category && <p className="text-amber text-xs mt-1">{errors.category}</p>}
        </Field>
        <Field label="Publisher">
          <Input value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} />
        </Field>
        <Field label="Publication Year" required>
          <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          {errors.year && <p className="text-amber text-xs mt-1">{errors.year}</p>}
        </Field>
        <Field label="Total Copies" required>
          <Input type="number" min="1" value={form.totalCopies} onChange={(e) => setForm({ ...form, totalCopies: e.target.value })} />
          {errors.totalCopies && <p className="text-amber text-xs mt-1">{errors.totalCopies}</p>}
        </Field>
        <Field label="Shelf Location">
          <Input value={form.shelf} onChange={(e) => setForm({ ...form, shelf: e.target.value })} placeholder="A1" />
        </Field>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t-2 border-ink">
        <Button variant="ghost" onClick={onClose}>
          CANCEL
        </Button>
        <Button variant="primary" onClick={submit}>
          <Icon name="check" className="w-3.5 h-3.5" />
          SAVE BOOK
        </Button>
      </div>
    </Modal>
  );
}

export default BookFormModal;
