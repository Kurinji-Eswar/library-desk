import { useMemo, useState } from 'react';
import Window from '../Layout/Window.jsx';
import Button from '../UI/Button.jsx';
import Select from '../UI/Select.jsx';
import StatBlock from '../UI/StatBlock.jsx';
import EmptyState from '../UI/EmptyState.jsx';
import Icon from '../icons/Icon.jsx';
import MemberTable from './MemberTable.jsx';
import MemberProfile from './MemberProfile.jsx';
import { useLibrary } from '../../context/LibraryContext.jsx';

function MembersView() {
  const { members, loans, setModal, selectedMemberId, setSelectedMemberId } = useLibrary();
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const activeLoanCount = (mid) => loans.filter((l) => l.memberId === mid && l.status !== 'RETURNED').length;

  const filtered = useMemo(
    () =>
      members.filter((m) => {
        if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
        if (typeFilter !== 'ALL' && m.membershipType !== typeFilter) return false;
        if (q && !(m.name.toLowerCase().includes(q.toLowerCase()) || m.email.toLowerCase().includes(q.toLowerCase()))) return false;
        return true;
      }),
    [members, statusFilter, typeFilter, q]
  );

  const newThisMonth = members.filter((m) => {
    const d = new Date(m.joinedDate);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).length;

  const selectedMember = selectedMemberId ? members.find((m) => m.id === selectedMemberId) : null;
  if (selectedMember) return <MemberProfile member={selectedMember} onClose={() => setSelectedMemberId(null)} />;

  return (
    <Window
      title="MEMBERS / DIRECTORY"
      status={`${filtered.length} SHOWN`}
      right={
        <Button variant="primary" onClick={() => setModal({ type: 'addMember' })}>
          <Icon name="plus" className="w-3.5 h-3.5" />
          ADD MEMBER
        </Button>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <StatBlock label="Total Members" value={members.length} />
        <StatBlock label="Active" value={members.filter((m) => m.status === 'ACTIVE').length} tone="blue" />
        <StatBlock label="Blocked" value={members.filter((m) => m.status === 'BLOCKED').length} tone="amber" />
        <StatBlock label="New This Month" value={newThisMonth} />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 border-2 border-ink bg-creamSoft px-3 py-2">
          <Icon name="search" className="w-4 h-4 text-grayish shrink-0" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="SEARCH MEMBERS..." className="bg-transparent outline-none text-sm w-full font-mono placeholder:text-grayish" />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-40">
          <option value="ALL">ALL STATUS</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="BLOCKED">BLOCKED</option>
        </Select>
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="sm:w-44">
          <option value="ALL">ALL MEMBERSHIP</option>
          <option value="Standard">STANDARD</option>
          <option value="Premium">PREMIUM</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="NO MEMBERS FOUND"
          body="Try changing your search or add a new member."
          action={
            <Button variant="primary" onClick={() => setModal({ type: 'addMember' })}>
              <Icon name="plus" className="w-3.5 h-3.5" />
              ADD MEMBER
            </Button>
          }
        />
      ) : (
        <MemberTable members={filtered} activeLoanCount={activeLoanCount} onSelect={setSelectedMemberId} />
      )}
    </Window>
  );
}

export default MembersView;
