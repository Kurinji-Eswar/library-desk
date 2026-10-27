function StatusFooter({ stats }) {
  return (
    <footer className="sticky bottom-0 z-40 border-t-2 border-ink bg-creamSoft px-3 sm:px-5 py-1.5 shadow-[0_-2px_0_#20201C]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono uppercase tracking-widest text-grayish">
        <span className="font-bold text-ink">LIBRARY / DESK v2.0</span>
        <span>{stats?.backendConnected ? 'POSTGRESQL 18 + HIKARICP' : 'LOCAL CACHE'}</span>
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${stats?.backendConnected ? 'bg-mint' : 'bg-gold'}`}></span>
          {stats?.backendConnected ? 'TRANSACTIONS PERSISTED' : 'CACHED'}
        </span>
        <span>{stats?.backendConnected ? 'REST API: HTTP 200' : 'LAST SYNC: LOCAL'}</span>
        <span className="ml-auto hidden sm:inline">
          {stats.totalBooks} COPIES · {stats.totalMembers} PATRONS · {stats.activeLoans} ACTIVE LOANS
        </span>
      </div>
    </footer>
  );
}

export default StatusFooter;
