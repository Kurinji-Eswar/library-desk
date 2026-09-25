import { useState } from 'react';
import Window from '../Layout/Window.jsx';
import Button from '../UI/Button.jsx';
import Select from '../UI/Select.jsx';
import Badge from '../UI/Badge.jsx';
import EmptyState from '../UI/EmptyState.jsx';
import Icon from '../icons/Icon.jsx';
import { fmtDate } from '../../utils/dateUtils.js';
import { useLibrary } from '../../context/LibraryContext.jsx';

function ReservationsView() {
  const { reservations, bookById, memberById, cancelReservation, markReady, fulfillReservation, setModal } = useLibrary();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const filtered = reservations
    .filter((r) => statusFilter === 'ALL' || r.status === statusFilter)
    .sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate));

  return (
    <Window
      title="RESERVATIONS / HOLD QUEUE"
      status={`${filtered.length} SHOWN`}
      right={
        <Button variant="primary" onClick={() => setModal({ type: 'newReservation' })}>
          <Icon name="plus" className="w-3.5 h-3.5" />
          NEW RESERVATION
        </Button>
      }
    >
      <div className="mb-4">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-52">
          <option value="ALL">ALL STATUS</option>
          <option value="WAITING">WAITING</option>
          <option value="READY">READY</option>
          <option value="FULFILLED">FULFILLED</option>
          <option value="CANCELLED">CANCELLED</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="NO RESERVATIONS" body="There are no reservations matching this filter." />
      ) : (
        <div className="noscroll-x">
          <table className="w-full text-sm border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b-2 border-ink text-left">
                {['RES ID', 'BOOK', 'MEMBER', 'REQUESTED', 'POSITION', 'STATUS', ''].map((h) => (
                  <th key={h} className="py-2 px-2 text-[10px] font-mono font-bold uppercase tracking-widest text-grayish">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const book = bookById(r.bookId);
                return (
                  <tr key={r.id} className="border-b border-ink/10">
                    <td className="py-2 px-2 font-mono text-xs text-grayish">{r.id}</td>
                    <td className="py-2 px-2 max-w-[160px] truncate">
                      {book?.title}
                      {book && book.availableCopies > 0 && r.status === 'WAITING' && (
                        <span className="ml-2">
                          <Badge tone="mint">COPY AVAILABLE</Badge>
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 max-w-[140px] truncate">{memberById(r.memberId)?.name}</td>
                    <td className="py-2 px-2 font-mono text-xs">{fmtDate(r.requestedDate)}</td>
                    <td className="py-2 px-2 font-mono text-xs">#{r.position}</td>
                    <td className="py-2 px-2">
                      <Badge tone={r.status === 'READY' ? 'mint' : r.status === 'CANCELLED' ? 'default' : r.status === 'FULFILLED' ? 'blue' : 'default'}>{r.status}</Badge>
                    </td>
                    <td className="py-2 px-2 flex gap-1.5 flex-wrap">
                      {r.status === 'WAITING' && (
                        <Button className="!px-2 !py-1" onClick={() => markReady(r.id)}>
                          MARK READY
                        </Button>
                      )}
                      {(r.status === 'WAITING' || r.status === 'READY') && (
                        <Button variant="primary" className="!px-2 !py-1" onClick={() => fulfillReservation(r.id)}>
                          FULFILL
                        </Button>
                      )}
                      {(r.status === 'WAITING' || r.status === 'READY') && (
                        <Button variant="danger" className="!px-2 !py-1" onClick={() => cancelReservation(r.id)}>
                          CANCEL
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

export default ReservationsView;
