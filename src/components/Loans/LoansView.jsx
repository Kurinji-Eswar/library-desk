import { useMemo, useState } from 'react';
import Window from '../Layout/Window.jsx';
import Button from '../UI/Button.jsx';
import Select from '../UI/Select.jsx';
import StatBlock from '../UI/StatBlock.jsx';
import EmptyState from '../UI/EmptyState.jsx';
import Icon from '../icons/Icon.jsx';
import LoanTable from './LoanTable.jsx';
import { useLibrary } from '../../context/LibraryContext.jsx';

function LoansView() {
  const { loans, bookById, memberById, setModal } = useLibrary();
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = useMemo(
    () =>
      loans
        .filter((l) => {
          if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
          if (q) {
            const book = bookById(l.bookId);
            const member = memberById(l.memberId);
            const hay = `${l.id} ${book?.title || ''} ${member?.name || ''}`.toLowerCase();
            if (!hay.includes(q.toLowerCase())) return false;
          }
          return true;
        })
        .sort((a, b) => new Date(b.borrowedDate) - new Date(a.borrowedDate)),
    [loans, statusFilter, q, bookById, memberById]
  );

  const thisMonth = loans.filter((l) => {
    const d = new Date(l.borrowedDate);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).length;

  return (
    <Window
      title="LOANS / CHECKOUT"
      status={`${filtered.length} SHOWN`}
      right={
        <Button variant="primary" onClick={() => setModal({ type: 'newLoan' })}>
          <Icon name="plus" className="w-3.5 h-3.5" />
          NEW LOAN
        </Button>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <StatBlock label="Active Loans" value={loans.filter((l) => l.status !== 'RETURNED').length} tone="blue" />
        <StatBlock label="Due Today" value={loans.filter((l) => l.status === 'DUE TODAY').length} />
        <StatBlock label="Overdue" value={loans.filter((l) => l.status === 'OVERDUE').length} tone="amber" />
        <StatBlock label="This Month" value={thisMonth} />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 border-2 border-ink bg-creamSoft px-3 py-2">
          <Icon name="search" className="w-4 h-4 text-grayish shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="SEARCH BY BOOK, MEMBER OR LOAN ID..."
            className="bg-transparent outline-none text-sm w-full font-mono placeholder:text-grayish"
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-48">
          <option value="ALL">ALL STATUS</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="DUE TODAY">DUE TODAY</option>
          <option value="OVERDUE">OVERDUE</option>
          <option value="RETURNED">RETURNED</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="NO LOANS FOUND"
          body="Try changing your search or create a new loan."
          action={
            <Button variant="primary" onClick={() => setModal({ type: 'newLoan' })}>
              <Icon name="plus" className="w-3.5 h-3.5" />
              NEW LOAN
            </Button>
          }
        />
      ) : (
        <LoanTable loans={filtered} />
      )}
    </Window>
  );
}

export default LoansView;
