import { useState } from 'react';
import Icon from '../icons/Icon.jsx';
import { useLibrary } from '../../context/LibraryContext.jsx';

export const NAV_ITEMS = [
  { key: 'desktop', label: 'DESKTOP', icon: 'desktop', shortcut: 'F1' },
  { key: 'books', label: 'BOOKS', icon: 'books', shortcut: 'F2' },
  { key: 'members', label: 'MEMBERS', icon: 'members', shortcut: 'F3' },
  { key: 'loans', label: 'LOANS', icon: 'loans', shortcut: 'F4' },
  { key: 'returns', label: 'RETURNS', icon: 'returns', shortcut: 'F5' },
  { key: 'reservations', label: 'RESERVATIONS', icon: 'reservations', shortcut: 'F6' },
  { key: 'categories', label: 'CATEGORIES', icon: 'categories', shortcut: 'F7' },
  { key: 'reports', label: 'REPORTS', icon: 'reports', shortcut: 'F8' },
  { key: 'settings', label: 'SYSTEM', icon: 'settings', shortcut: 'F9' },
];

function Sidebar() {
  const { view, navigate } = useLibrary();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-40 w-12 h-12 border-2 border-ink bg-blue text-cream shadow-hard flex items-center justify-center focus-ring"
        aria-label="Open navigation menu"
      >
        <Icon name="menu" className="w-5 h-5" />
      </button>
      {open && <div className="fixed inset-0 bg-ink/40 z-40 md:hidden" onClick={() => setOpen(false)}></div>}
      <aside
        className={`
        fixed md:sticky top-0 md:top-[47px] left-0 h-full md:h-[calc(100vh-47px-31px)] z-50 md:z-30
        w-64 md:w-56 shrink-0 border-r-2 border-ink bg-creamSoft
        transform transition-transform md:transform-none
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        overflow-y-auto self-start
      `}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="p-3 flex items-center justify-between md:hidden border-b-2 border-ink">
          <span className="font-mono text-xs font-bold uppercase">Navigate</span>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="focus-ring">
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>
        <nav className="p-3 flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                navigate(item.key);
                setOpen(false);
              }}
              className={`focus-ring group flex items-center gap-3 px-3 py-2.5 border-2 text-left transition-colors
                ${view === item.key ? 'bg-ink text-cream border-ink shadow-hardxs' : 'bg-cream text-ink border-transparent hover:border-ink'}`}
            >
              <Icon name={item.icon} className="w-4 h-4 shrink-0" />
              <span className="flex-1 font-mono text-xs font-bold uppercase tracking-wide">{item.label}</span>
              <span className={`text-[9px] font-mono px-1 border ${view === item.key ? 'border-cream/40 text-cream/70' : 'border-grayish/40 text-grayish'}`}>{item.shortcut}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
