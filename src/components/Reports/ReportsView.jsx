import { useMemo } from 'react';
import Window from '../Layout/Window.jsx';
import Badge from '../UI/Badge.jsx';
import StatBlock from '../UI/StatBlock.jsx';
import EmptyState from '../UI/EmptyState.jsx';
import Bar from './Bar.jsx';
import BookCover from '../Books/BookCover.jsx';
import { useLibrary } from '../../context/LibraryContext.jsx';

function ReportsView() {
  const { books, members, loans, reservations, categories, stats, bookById } = useLibrary();
  const maxCat = Math.max(1, ...categories.map((c) => books.filter((b) => b.category === c.name).length));

  const thisMonthLoans = loans.filter((l) => {
    const d = new Date(l.borrowedDate);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).length;

  const thisMonthReturns = loans.filter((l) => {
    if (!l.returnedDate) return false;
    const d = new Date(l.returnedDate);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).length;

  const topBooks = useMemo(() => {
    const counts = {};
    loans.forEach((l) => {
      counts[l.bookId] = (counts[l.bookId] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([bookId, count]) => ({ book: bookById(bookId), count }));
  }, [loans, bookById]);

  return (
    <div className="space-y-4">
      <Window title="REPORTS / LIBRARY OVERVIEW">
        <p className="text-xs text-grayish mb-4 font-mono">Simple client-side calculations from your local data — no external analytics.</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <StatBlock label="Total Books" value={stats.totalBooks} />
          <StatBlock label="Total Members" value={members.length} />
          <StatBlock label="Active Loans" value={stats.activeLoans} tone="blue" />
          <StatBlock label="Overdue Loans" value={stats.overdue} tone="amber" />
          <StatBlock label="Reservations" value={reservations.filter((r) => r.status === 'WAITING' || r.status === 'READY').length} />
        </div>
      </Window>

      <div className="grid md:grid-cols-2 gap-4">
        <Window title="BOOK UTILIZATION">
          <Bar label="Available" value={stats.available} max={stats.totalBooks} tone="mint" />
          <Bar label="Borrowed" value={stats.borrowed} max={stats.totalBooks} tone="amber" />
        </Window>
        <Window title="BORROWING & RETURNS">
          <Bar label="Loans this month" value={thisMonthLoans} max={Math.max(thisMonthLoans, thisMonthReturns, 1)} tone="blue" />
          <Bar label="Returns this month" value={thisMonthReturns} max={Math.max(thisMonthLoans, thisMonthReturns, 1)} tone="mint" />
        </Window>
      </div>

      <Window title="CATEGORY DISTRIBUTION">
        {categories.map((c) => (
          <Bar key={c.id} label={c.name} value={books.filter((b) => b.category === c.name).length} max={maxCat} tone="blue" />
        ))}
      </Window>

      <Window title="TOP BORROWED BOOKS">
        {topBooks.length === 0 || !topBooks[0].book ? (
          <EmptyState title="NO DATA YET" body="Borrowing activity will appear here." />
        ) : (
          <ul className="divide-y-2 divide-ink/10">
            {topBooks.map(
              (t, i) =>
                t.book && (
                  <li key={t.book.id} className="py-2 flex items-center gap-3 text-sm">
                    <span className="font-mono text-grayish w-5">{i + 1}.</span>
                    <BookCover title={t.book.title} author={t.book.author} category={t.book.category} size="sm" />
                    <span className="flex-1 truncate">{t.book.title}</span>
                    <Badge tone="blue">{t.count} loans</Badge>
                  </li>
                )
            )}
          </ul>
        )}
      </Window>
    </div>
  );
}

export default ReportsView;
