import { useMemo, useState } from 'react';
import Icon from '../icons/Icon.jsx';
import { fmtDate, fmtTime } from '../../utils/dateUtils.js';
import { useLibrary } from '../../context/LibraryContext.jsx';

const MENU_CONTENTS = {
  FILE: [
    { label: 'EXPORT DATA', view: 'settings' },
    { label: 'RESET DEMO DATA', view: 'settings' },
  ],
  EDIT: [
    { label: 'ADD BOOK', view: 'books' },
    { label: 'ADD MEMBER', view: 'members' },
  ],
  VIEW: [
    { label: 'DESKTOP', view: 'desktop' },
    { label: 'REPORTS', view: 'reports' },
  ],
  LIBRARY: [
    { label: 'BOOKS', view: 'books' },
    { label: 'LOANS', view: 'loans' },
    { label: 'RESERVATIONS', view: 'reservations' },
  ],
  HELP: [{ label: 'ABOUT LIBRARY OS', view: 'settings' }],
};

function TopBar() {
  const { navigate, books, members, loans, now, setSelectedBookId, setSelectedMemberId } = useLibrary();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return null;
    return {
      books: books.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)).slice(0, 5),
      members: members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)).slice(0, 5),
      loans: loans.filter((l) => l.id.toLowerCase().includes(q)).slice(0, 5),
    };
  }, [globalSearch, books, members, loans]);

  const openResult = (type, id) => {
    setSearchOpen(false);
    setGlobalSearch('');
    if (type === 'books') {
      navigate('books');
      setSelectedBookId(id);
    }
    if (type === 'members') {
      navigate('members');
      setSelectedMemberId(id);
    }
    if (type === 'loans') {
      navigate('loans');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-cream" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="px-3 sm:px-5 py-2 flex items-center gap-3">
        <button onClick={() => navigate('desktop')} className="focus-ring flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 border-2 border-ink bg-blue flex items-center justify-center">
            <Icon name="monitor" className="w-4 h-4 text-cream" />
          </div>
          <span className="font-display font-bold text-sm tracking-tight hidden xs:inline">
            LIBRARY <span className="text-blue">/</span> DESK
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-4 ml-4 font-mono text-xs uppercase tracking-wider text-grayish relative">
          {['FILE', 'EDIT', 'VIEW', 'LIBRARY', 'HELP'].map((m) => (
            <div key={m} className="relative">
              <button onClick={() => setMenuOpen(m === menuOpen ? false : m)} className="focus-ring hover:text-ink relative">
                {m}
              </button>
              {menuOpen === m && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-2 border-2 border-ink bg-cream shadow-hardsm z-50 min-w-[180px] win-anim">
                    {MENU_CONTENTS[m].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          navigate(item.view);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-[11px] hover:bg-mint/40 text-ink focus-ring block"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>

        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-sm">
            <button onClick={() => setSearchOpen(true)} className="w-full flex items-center gap-2 border-2 border-ink bg-creamSoft px-3 py-1.5 text-left focus-ring">
              <Icon name="search" className="w-3.5 h-3.5 text-grayish shrink-0" />
              <span className="text-xs font-mono text-grayish truncate">SEARCH BOOKS, MEMBERS, LOANS...</span>
            </button>
            {searchOpen && (
              <div className="absolute top-full mt-1 left-0 right-0 border-2 border-ink bg-cream shadow-hard z-50 win-anim">
                <div className="flex items-center gap-2 border-b-2 border-ink px-3 py-2">
                  <Icon name="search" className="w-4 h-4 text-grayish" />
                  <input
                    autoFocus
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    placeholder="Type to search..."
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setGlobalSearch('');
                    }}
                    aria-label="Close search"
                    className="focus-ring"
                  >
                    <Icon name="close" className="w-4 h-4 text-grayish" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {!searchResults && <div className="text-xs text-grayish font-mono p-3">START TYPING TO SEARCH...</div>}
                  {searchResults && searchResults.books.length + searchResults.members.length + searchResults.loans.length === 0 && (
                    <div className="text-xs text-grayish font-mono p-3">NO RESULTS FOUND.</div>
                  )}
                  {searchResults?.books.length > 0 && (
                    <div className="mb-2">
                      <div className="text-[10px] font-mono font-bold text-grayish uppercase px-2 py-1">Books</div>
                      {searchResults.books.map((b) => (
                        <button key={b.id} onClick={() => openResult('books', b.id)} className="w-full text-left px-2 py-1.5 hover:bg-mint/40 text-sm flex items-center gap-2 focus-ring">
                          <Icon name="books" className="w-3.5 h-3.5 text-blue shrink-0" /> <span className="truncate">{b.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults?.members.length > 0 && (
                    <div className="mb-2">
                      <div className="text-[10px] font-mono font-bold text-grayish uppercase px-2 py-1">Members</div>
                      {searchResults.members.map((m) => (
                        <button key={m.id} onClick={() => openResult('members', m.id)} className="w-full text-left px-2 py-1.5 hover:bg-mint/40 text-sm flex items-center gap-2 focus-ring">
                          <Icon name="members" className="w-3.5 h-3.5 text-blue shrink-0" /> <span className="truncate">{m.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults?.loans.length > 0 && (
                    <div>
                      <div className="text-[10px] font-mono font-bold text-grayish uppercase px-2 py-1">Loans</div>
                      {searchResults.loans.map((l) => (
                        <button key={l.id} onClick={() => openResult('loans', l.id)} className="w-full text-left px-2 py-1.5 hover:bg-mint/40 text-sm flex items-center gap-2 focus-ring">
                          <Icon name="loans" className="w-3.5 h-3.5 text-blue shrink-0" /> <span className="truncate">{l.id}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-grayish shrink-0">
          <span>{fmtDate(now)}</span>
          <span className="text-ink">{fmtTime(now)}</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest shrink-0">
          <span className="text-grayish">LOCAL MODE</span>
          <span className="w-2 h-2 rounded-full bg-mint border border-ink blinker"></span>
          <span>READY</span>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
