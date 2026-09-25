import Window from '../Layout/Window.jsx';
import Button from '../UI/Button.jsx';
import Badge from '../UI/Badge.jsx';
import StatBlock from '../UI/StatBlock.jsx';
import EmptyState from '../UI/EmptyState.jsx';
import Icon from '../icons/Icon.jsx';
import { fmtDate } from '../../utils/dateUtils.js';
import { useLibrary } from '../../context/LibraryContext.jsx';

function MemberProfile({ member, onClose }) {
  const { loans, bookById, setModal, setConfirm, deleteMember, toggleBlockMember, reservations } = useLibrary();
  const memberLoans = loans.filter((l) => l.memberId === member.id).sort((a, b) => new Date(b.borrowedDate) - new Date(a.borrowedDate));
  const current = memberLoans.filter((l) => l.status !== 'RETURNED');
  const historyLoans = memberLoans.filter((l) => l.status === 'RETURNED');
  const overdue = current.filter((l) => l.status === 'OVERDUE');
  const totalFines = memberLoans.reduce((s, l) => s + (l.fine || 0), 0);
  const memberReservations = reservations.filter((r) => r.memberId === member.id && r.status !== 'CANCELLED' && r.status !== 'FULFILLED');

  return (
    <Window title={`MEMBERS / ${member.id}`} onClose={onClose}>
      <div className="flex flex-col sm:flex-row gap-5 mb-5">
        <div className="w-16 h-16 border-2 border-ink bg-mint flex items-center justify-center shrink-0 shadow-hardxs">
          <Icon name="user" className="w-8 h-8" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge>{member.id}</Badge>
            <Badge tone={member.status === 'ACTIVE' ? 'mint' : 'amber'}>{member.status}</Badge>
            <Badge tone="blue">{member.membershipType?.toUpperCase()}</Badge>
          </div>
          <h2 className="font-display font-bold text-xl">{member.name}</h2>
          <p className="text-sm text-grayish mb-3">
            {member.email} · {member.phone}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setModal({ type: 'editMember', payload: member })}>
              <Icon name="edit" className="w-3.5 h-3.5" />
              EDIT MEMBER
            </Button>
            <Button variant={member.status === 'BLOCKED' ? 'mint' : 'danger'} onClick={() => toggleBlockMember(member.id)}>
              {member.status === 'BLOCKED' ? 'UNBLOCK MEMBER' : 'BLOCK MEMBER'}
            </Button>
            <Button variant="primary" onClick={() => setModal({ type: 'newLoan', payload: { memberId: member.id } })} disabled={member.status === 'BLOCKED'}>
              <Icon name="loans" className="w-3.5 h-3.5" />
              NEW LOAN
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                setConfirm({
                  title: 'DELETE MEMBER',
                  body: `Remove "${member.name}" from the directory?`,
                  confirmLabel: 'DELETE',
                  danger: true,
                  onConfirm: () => {
                    deleteMember(member.id);
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
        <StatBlock label="Books Borrowed" value={memberLoans.length} />
        <StatBlock label="Active Loans" value={current.length} tone="blue" />
        <StatBlock label="Overdue" value={overdue.length} tone="amber" />
        <StatBlock label="Total Fines" value={`₹${totalFines}`} />
      </div>

      <div className="grid sm:grid-cols-2 gap-2 mb-5 text-sm">
        <div>
          <span className="text-grayish">Address: </span>
          {member.address}
        </div>
        <div>
          <span className="text-grayish">Joined: </span>
          {fmtDate(member.joinedDate)}
        </div>
      </div>

      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-grayish mb-2">Current Loans</div>
      {current.length === 0 ? (
        <div className="text-sm text-grayish mb-5">No active loans.</div>
      ) : (
        <ul className="divide-y-2 divide-ink/10 mb-5">
          {current.map((l) => (
            <li key={l.id} className="py-2 flex items-center gap-3 text-sm">
              <Badge tone={l.status === 'OVERDUE' ? 'amber' : 'mint'}>{l.status}</Badge>
              <span className="flex-1 truncate">{bookById(l.bookId)?.title || 'Unknown book'}</span>
              <span className="text-grayish text-xs font-mono">Due {fmtDate(l.dueDate)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-grayish mb-2">Reservations</div>
      {memberReservations.length === 0 ? (
        <div className="text-sm text-grayish mb-5">No active reservations.</div>
      ) : (
        <ul className="divide-y-2 divide-ink/10 mb-5">
          {memberReservations.map((r) => (
            <li key={r.id} className="py-2 flex items-center gap-3 text-sm">
              <Badge tone={r.status === 'READY' ? 'mint' : 'default'}>{r.status}</Badge>
              <span className="flex-1 truncate">{bookById(r.bookId)?.title}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-grayish mb-2">Borrowing History</div>
      {historyLoans.length === 0 ? (
        <EmptyState title="NO HISTORY" body="No returned loans yet." />
      ) : (
        <ul className="divide-y-2 divide-ink/10">
          {historyLoans.map((l) => (
            <li key={l.id} className="py-2 flex items-center gap-3 text-sm">
              <Badge>RETURNED</Badge>
              <span className="flex-1 truncate">{bookById(l.bookId)?.title}</span>
              <span className="text-grayish text-xs font-mono">{fmtDate(l.returnedDate)}</span>
            </li>
          ))}
        </ul>
      )}
    </Window>
  );
}

export default MemberProfile;
