import { useState } from 'react';
import Window from '../Layout/Window.jsx';
import Button from '../UI/Button.jsx';
import Badge from '../UI/Badge.jsx';
import EmptyState from '../UI/EmptyState.jsx';
import Icon from '../icons/Icon.jsx';
import { fmtDate, daysBetween, todayISO } from '../../utils/dateUtils.js';
import { useLibrary } from '../../context/LibraryContext.jsx';

function ReturnsView() {
  const { loans, bookById, memberById, processReturn, setConfirm } = useLibrary();
  const [q, setQ] = useState('');
  const active = loans.filter((l) => l.status !== 'RETURNED');

  const filtered = active.filter((l) => {
    if (!q) return true;
    const book = bookById(l.bookId);
    const member = memberById(l.memberId);
    return `${l.id} ${book?.title || ''} ${member?.name || ''}`.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <Window title="RETURNS / CHECK-IN" status={`${active.length} ACTIVE`}>
      <div className="flex items-center gap-2 border-2 border-ink bg-creamSoft px-3 py-2 mb-4">
        <Icon name="search" className="w-4 h-4 text-grayish shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="SEARCH LOAN / BOOK / MEMBER..."
          className="bg-transparent outline-none text-sm w-full font-mono placeholder:text-grayish"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="NOTHING TO RETURN" body="There are no active loans matching your search." />
      ) : (
        <div className="noscroll-x">
          <table className="w-full text-sm border-collapse min-w-[820px]">
            <thead>
              <tr className="border-b-2 border-ink text-left">
                {['LOAN ID', 'BOOK', 'MEMBER', 'DUE DATE', 'STATUS', 'DAYS LATE', 'FINE', ''].map((h) => (
                  <th key={h} className="py-2 px-2 text-[10px] font-mono font-bold uppercase tracking-widest text-grayish">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const daysLate = Math.max(0, daysBetween(l.dueDate, todayISO()));
                return (
                  <tr key={l.id} className="border-b border-ink/10">
                    <td className="py-2 px-2 font-mono text-xs text-grayish">{l.id}</td>
                    <td className="py-2 px-2 max-w-[160px] truncate">{bookById(l.bookId)?.title}</td>
                    <td className="py-2 px-2 max-w-[140px] truncate">{memberById(l.memberId)?.name}</td>
                    <td className="py-2 px-2 font-mono text-xs">{fmtDate(l.dueDate)}</td>
                    <td className="py-2 px-2">
                      <Badge tone={l.status === 'OVERDUE' ? 'amber' : 'mint'}>{l.status}</Badge>
                    </td>
                    <td className="py-2 px-2 font-mono text-xs">{daysLate}</td>
                    <td className="py-2 px-2 font-mono text-xs">{l.fine ? `₹${l.fine}` : '—'}</td>
                    <td className="py-2 px-2 flex gap-1.5">
                      <Button variant="primary" className="!px-2 !py-1" onClick={() => processReturn(l.id, false)}>
                        PROCESS RETURN
                      </Button>
                      {l.fine > 0 && (
                        <Button
                          className="!px-2 !py-1"
                          onClick={() =>
                            setConfirm({
                              title: 'WAIVE FINE',
                              body: `Waive the ₹${l.fine} fine for loan ${l.id} and mark it returned?`,
                              confirmLabel: 'WAIVE & RETURN',
                              onConfirm: () => {
                                processReturn(l.id, true);
                                setConfirm(null);
                              },
                            })
                          }
                        >
                          WAIVE FINE
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Window>
  );
}

export default ReturnsView;
