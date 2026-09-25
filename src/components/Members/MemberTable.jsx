import Badge from '../UI/Badge.jsx';
import Icon from '../icons/Icon.jsx';
import { fmtDate } from '../../utils/dateUtils.js';

const COLUMNS = ['ID', 'NAME', 'EMAIL', 'PHONE', 'JOINED', 'LOANS', 'STATUS', ''];

function MemberTable({ members, activeLoanCount, onSelect }) {
  return (
    <div className="noscroll-x">
      <table className="w-full text-sm border-collapse min-w-[720px]">
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
          {members.map((m) => (
            <tr key={m.id} className="border-b border-ink/10 hover:bg-creamSoft/60 cursor-pointer" onClick={() => onSelect(m.id)}>
              <td className="py-2 px-2 font-mono text-xs text-grayish">{m.id}</td>
              <td className="py-2 px-2 font-medium">{m.name}</td>
              <td className="py-2 px-2 text-grayish max-w-[160px] truncate">{m.email}</td>
              <td className="py-2 px-2 font-mono text-xs">{m.phone}</td>
              <td className="py-2 px-2 font-mono text-xs">{fmtDate(m.joinedDate)}</td>
              <td className="py-2 px-2 font-mono text-xs">{activeLoanCount(m.id)}</td>
              <td className="py-2 px-2">
                <Badge tone={m.status === 'ACTIVE' ? 'mint' : 'amber'}>{m.status}</Badge>
              </td>
              <td className="py-2 px-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(m.id);
                  }}
                  className="focus-ring text-blue"
                  aria-label={`Open ${m.name}`}
                >
                  <Icon name="chevronRight" className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MemberTable;
