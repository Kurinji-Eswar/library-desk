import Window from './Layout/Window.jsx';
import DesktopIcon from './Layout/DesktopIcon.jsx';
import Badge from './UI/Badge.jsx';
import Button from './UI/Button.jsx';
import StatBlock from './UI/StatBlock.jsx';
import EmptyState from './UI/EmptyState.jsx';
import Icon from './icons/Icon.jsx';
import { fmtDate, fmtTime } from '../utils/dateUtils.js';
import { useLibrary } from '../context/LibraryContext.jsx';

const DESKTOP_ICONS = [
  { label: 'BOOKS', icon: 'books', view: 'books' },
  { label: 'MEMBERS', icon: 'members', view: 'members' },
  { label: 'LOANS', icon: 'loans', view: 'loans' },
  { label: 'RETURNS', icon: 'returns', view: 'returns' },
  { label: 'REPORTS', icon: 'reports', view: 'reports' },
  { label: 'SYSTEM', icon: 'settings', view: 'settings' },
];

function DesktopView() {
  const { stats, activity, now, navigate, reservations, setModal } = useLibrary();
  const dueTodayCount = stats.dueToday;
  const pendingReservations = reservations.filter((r) => r.status === 'WAITING' || r.status === 'READY').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
      <div className="space-y-5">
        <Window title="LIBRARY / DESK — DESKTOP" status="SYSTEM READY">
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-1">
              <Badge tone="mint">SYSTEM READY</Badge>
              <Badge>LOCAL STORAGE</Badge>
              <Badge>NO SERVER</Badge>
            </div>
            <h1 className="font-display font-bold text-2xl mt-3">
              Good {now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening'}, Librarian.
            </h1>
            <p className="text-sm text-grayish mt-1">Here&apos;s what&apos;s happening across the shelves today.</p>
          </div>

          <div className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-grayish">Library Status</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
            <StatBlock label="Books" value={stats.totalBooks} />
            <StatBlock label="Available" value={stats.available} tone="blue" />
            <StatBlock label="Borrowed" value={stats.borrowed} />
            <StatBlock label="Overdue" value={stats.overdue} tone="amber" />
            <StatBlock label="Members" value={stats.totalMembers} />
            <StatBlock label="Active Loans" value={stats.activeLoans} />
          </div>

          <div className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-grayish">Quick Actions</div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => navigate('books')}>
              <Icon name="books" className="w-3.5 h-3.5" />
              OPEN BOOKS
            </Button>
            <Button
              onClick={() => {
                navigate('books');
                setModal({ type: 'addBook' });
              }}
            >
              <Icon name="plus" className="w-3.5 h-3.5" />
              ADD BOOK
            </Button>
            <Button
              onClick={() => {
                navigate('members');
                setModal({ type: 'addMember' });
              }}
            >
              <Icon name="plus" className="w-3.5 h-3.5" />
              ADD MEMBER
            </Button>
            <Button
              variant="mint"
              onClick={() => {
                navigate('loans');
                setModal({ type: 'newLoan' });
              }}
            >
              <Icon name="loans" className="w-3.5 h-3.5" />
              NEW LOAN
            </Button>
            <Button onClick={() => navigate('returns')}>
              <Icon name="returns" className="w-3.5 h-3.5" />
              PROCESS RETURN
            </Button>
          </div>
        </Window>

        <Window title="RECENT ACTIVITY">
          {activity.length === 0 ? (
            <EmptyState title="NO ACTIVITY YET" body="Actions you take will appear here." />
          ) : (
            <ul className="divide-y-2 divide-ink/10">
              {activity.slice(0, 8).map((a) => (
                <li key={a.id} className="py-2 flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue shrink-0"></span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-grayish">{a.type}</div>
                    <div className="text-sm truncate">{a.text}</div>
                  </div>
                  <div className="ml-auto text-[10px] font-mono text-grayish shrink-0">{fmtTime(a.at)}</div>
                </li>
              ))}
            </ul>
          )}
        </Window>
      </div>

      <div className="space-y-4">
        <Window title="TODAY">
          <div className="space-y-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-grayish">Date</div>
              <div className="font-display font-bold">{fmtDate(now)}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-grayish">Time</div>
              <div className="font-display font-bold">{fmtTime(now)}</div>
            </div>
            <div className="border-t-2 border-ink/10 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-grayish">Loans due today</span>
                <Badge tone={dueTodayCount ? 'amber' : 'default'}>{dueTodayCount}</Badge>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-grayish">Reservations pending</span>
                <Badge tone={pendingReservations ? 'blue' : 'default'}>{pendingReservations}</Badge>
              </div>
            </div>
          </div>
        </Window>

        <div className="border-2 border-ink bg-cream shadow-hard p-3">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-grayish mb-3">Desktop Icons</div>
          <div className="grid grid-cols-3 gap-2">
            {DESKTOP_ICONS.map((d) => (
              <DesktopIcon key={d.label} label={d.label} icon={d.icon} onClick={() => navigate(d.view)} />
            ))}
          </div>
        </div>

        <div className="border-2 border-ink bg-ink text-cream shadow-hard p-3 font-mono text-[10px] uppercase tracking-widest space-y-1">
          <div>LIBRARY OS v1.0</div>
          <div className="text-cream/60">LOCAL MODE</div>
          <div className="text-cream/60">MEMORY: OK</div>
          <div className="text-cream/60">DATA: SAVED</div>
        </div>
      </div>
    </div>
  );
}

export default DesktopView;
