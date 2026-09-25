import Badge from '../UI/Badge.jsx';
import Button from '../UI/Button.jsx';
import { fmtDate } from '../../utils/dateUtils.js';
import { useLibrary } from '../../context/LibraryContext.jsx';

const COLUMNS = ['LOAN ID', 'BOOK', 'MEMBER', 'BORROWED', 'DUE DATE', 'STATUS', ''];

function LoanTable({ loans }) {
  const { bookById, memberById, processReturn } = useLibrary();
  return (
    <div className="noscroll-x">
      <table className="w-full text-sm border-collapse min-w-[760px]">
        <thead>
          <tr className="border-b-2 border-ink text-left">
            {COLUMNS.map((h) => (
              <th key={h} className="py-2 px-2 text-[10px] font-mono font-bold uppercase tracking-widest text-grayish">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loans.map((l) => (
            <tr key={l.id} className="border-b border-ink/10">
              <td className="py-2 px-2 font-mono text-xs text-grayish">{l.id}</td>
              <td className="py-2 px-2 max-w-[160px] truncate">{bookById(l.bookId)?.title || '—'}</td>
              <td className="py-2 px-2 max-w-[140px] truncate">{memberById(l.memberId)?.name || '—'}</td>
              <td className="py-2 px-2 font-mono text-xs">{fmtDate(l.borrowedDate)}</td>
              <td className="py-2 px-2 font-mono text-xs">{fmtDate(l.dueDate)}</td>
              <td className="py-2 px-2">
                <Badge tone={l.status === 'OVERDUE' ? 'amber' : l.status === 'RETURNED' ? 'default' : 'mint'}>{l.status}</Badge>
              </td>
              <td className="py-2 px-2">
                {l.status !== 'RETURNED' && (
                  <Button className="!px-2 !py-1" onClick={() => processReturn(l.id, false)}>
                    RETURN
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LoanTable;
