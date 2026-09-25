function StatusFooter({ stats }) {
  return (
    <footer className="sticky bottom-0 z-40 border-t-2 border-ink bg-creamSoft px-3 sm:px-5 py-1.5 shadow-[0_-2px_0_#20201C]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono uppercase tracking-widest text-grayish">
        <span className="font-bold text-ink">LIBRARY OS v1.0</span>
        <span>LOCAL STORAGE</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-mint"></span>DATA SAVED
        </span>
        <span>LAST SYNC: LOCAL</span>
        <span className="ml-auto hidden sm:inline">
          {stats.totalBooks} BOOKS · {stats.totalMembers} MEMBERS
        </span>
      </div>
    </footer>
  );
}

export default StatusFooter;
