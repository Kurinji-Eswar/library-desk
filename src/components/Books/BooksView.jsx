import { useMemo, useState } from 'react';
import Window from '../Layout/Window.jsx';
import Button from '../UI/Button.jsx';
import Select from '../UI/Select.jsx';
import StatBlock from '../UI/StatBlock.jsx';
import EmptyState from '../UI/EmptyState.jsx';
import Icon from '../icons/Icon.jsx';
import BookTable from './BookTable.jsx';
import BookDetails from './BookDetails.jsx';
import { useLibrary } from '../../context/LibraryContext.jsx';

function BooksView() {
  const { books, categories, setModal, stats, reservations, selectedBookId, setSelectedBookId } = useLibrary();
  const [q, setQ] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [availFilter, setAvailFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return books.filter((b) => {
      if (catFilter !== 'ALL' && b.category !== catFilter) return false;
      if (availFilter === 'AVAILABLE' && b.availableCopies < 1) return false;
      if (availFilter === 'UNAVAILABLE' && b.availableCopies > 0) return false;
      if (q && !(b.title.toLowerCase().includes(q.toLowerCase()) || b.author.toLowerCase().includes(q.toLowerCase()) || b.id.toLowerCase().includes(q.toLowerCase())))
        return false;
      return true;
    });
  }, [books, catFilter, availFilter, q]);

  const selectedBook = selectedBookId ? books.find((b) => b.id === selectedBookId) : null;

  if (selectedBook) return <BookDetails book={selectedBook} onClose={() => setSelectedBookId(null)} />;

  return (
    <Window
      title="BOOKS / COLLECTION"
      status={`${filtered.length} SHOWN`}
      right={
        <Button variant="primary" onClick={() => setModal({ type: 'addBook' })}>
          <Icon name="plus" className="w-3.5 h-3.5" />
          ADD BOOK
        </Button>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <StatBlock label="Total Books" value={books.reduce((s, b) => s + b.totalCopies, 0)} />
        <StatBlock label="Available" value={stats.available} tone="blue" />
        <StatBlock label="Borrowed" value={stats.borrowed} />
        <StatBlock label="Reserved" value={reservations.filter((r) => r.status === 'WAITING' || r.status === 'READY').length} tone="amber" />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 border-2 border-ink bg-creamSoft px-3 py-2">
          <Icon name="search" className="w-4 h-4 text-grayish shrink-0" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="SEARCH BOOKS..." className="bg-transparent outline-none text-sm w-full font-mono placeholder:text-grayish" />
        </div>
        <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="sm:w-48">
          <option value="ALL">ALL CATEGORIES</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select value={availFilter} onChange={(e) => setAvailFilter(e.target.value)} className="sm:w-44">
          <option value="ALL">ALL AVAILABILITY</option>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="UNAVAILABLE">UNAVAILABLE</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="NO BOOKS FOUND"
          body="The library shelves are empty. Try changing your search or add a new book."
          action={
            <Button variant="primary" onClick={() => setModal({ type: 'addBook' })}>
              <Icon name="plus" className="w-3.5 h-3.5" />
              ADD BOOK
            </Button>
          }
        />
      ) : (
        <BookTable books={filtered} onSelect={setSelectedBookId} />
      )}
    </Window>
  );
}

export default BooksView;
