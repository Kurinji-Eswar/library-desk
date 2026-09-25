import Window from '../Layout/Window.jsx';
import Button from '../UI/Button.jsx';
import Badge from '../UI/Badge.jsx';
import StatBlock from '../UI/StatBlock.jsx';
import EmptyState from '../UI/EmptyState.jsx';
import Icon from '../icons/Icon.jsx';
import BookCover from './BookCover.jsx';
import { fmtDate } from '../../utils/dateUtils.js';
import { useLibrary } from '../../context/LibraryContext.jsx';

function BookDetails({ book, onClose }) {
  const { loans, memberById, setModal, setConfirm, deleteBook } = useLibrary();
  const history = loans.filter((l) => l.bookId === book.id).sort((a, b) => new Date(b.borrowedDate) - new Date(a.borrowedDate));
  const borrowedCopies = book.totalCopies - book.availableCopies;

  return (
    <Window title={`BOOKS / ${book.id}`} onClose={onClose}>
      <div className="flex flex-col sm:flex-row gap-5 mb-5">
        <BookCover title={book.title} author={book.author} category={book.category} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge>{book.id}</Badge>
            <Badge tone={book.availableCopies > 0 ? 'mint' : 'amber'}>{book.availableCopies > 0 ? 'AVAILABLE' : 'ALL COPIES OUT'}</Badge>
          </div>
          <h2 className="font-display font-bold text-xl">{book.title}</h2>
          <p className="text-sm text-grayish mb-3">by {book.author}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => setModal({ type: 'newLoan', payload: { bookId: book.id } })} disabled={book.availableCopies < 1}>
              <Icon name="loans" className="w-3.5 h-3.5" />
              BORROW
            </Button>
            <Button onClick={() => setModal({ type: 'newReservation', payload: { bookId: book.id } })}>
              <Icon name="reservations" className="w-3.5 h-3.5" />
              RESERVE
            </Button>
            <Button onClick={() => setModal({ type: 'editBook', payload: book })}>
              <Icon name="edit" className="w-3.5 h-3.5" />
              EDIT BOOK
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                setConfirm({
                  title: 'DELETE BOOK',
                  body: `Remove "${book.title}" from the collection? This cannot be undone.`,
                  confirmLabel: 'DELETE',
                  danger: true,
                  onConfirm: () => {
                    deleteBook(book.id);
                    setConfirm(null);
                    onClose();
                  },
                })
              }
            >
              <Icon name="trash" className="w-3.5 h-3.5" />
              DELETE
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
        <StatBlock label="ISBN" value={<span className="text-sm font-mono">{book.isbn}</span>} />
        <StatBlock label="Category" value={<span className="text-sm">{book.category}</span>} />
        <StatBlock label="Publisher" value={<span className="text-sm">{book.publisher}</span>} />
        <StatBlock label="Year" value={book.year} />
        <StatBlock label="Total Copies" value={book.totalCopies} />
        <StatBlock label="Available" value={book.availableCopies} tone="blue" />
        <StatBlock label="Borrowed" value={borrowedCopies} />
        <StatBlock label="Shelf" value={book.shelf} />
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-grayish mb-4">Added {fmtDate(book.addedDate)}</div>

      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-grayish mb-2">Borrowing History</div>
      {history.length === 0 ? (
        <EmptyState title="NO HISTORY" body="This book has not been borrowed yet." />
      ) : (
        <ul className="divide-y-2 divide-ink/10">
          {history.map((l) => (
            <li key={l.id} className="py-2 flex items-center gap-3 text-sm">
              <Badge tone={l.status === 'RETURNED' ? 'default' : l.status === 'OVERDUE' ? 'amber' : 'mint'}>{l.status}</Badge>
              <span className="flex-1 truncate">{memberById(l.memberId)?.name || 'Unknown member'}</span>
              <span className="text-grayish text-xs font-mono">
                {fmtDate(l.borrowedDate)} → {fmtDate(l.dueDate)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Window>
  );
}

export default BookDetails;
