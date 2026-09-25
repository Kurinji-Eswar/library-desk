function StatBlock({ label, value, tone = 'default' }) {
  return (
    <div className="border-2 border-ink bg-cream px-3 py-2 shadow-hardxs">
      <div className="text-[10px] font-mono uppercase tracking-widest text-grayish">{label}</div>
      <div className={`text-2xl font-display font-bold ${tone === 'amber' ? 'text-amber' : tone === 'blue' ? 'text-blue' : 'text-ink'}`}>{value}</div>
    </div>
  );
}

export default StatBlock;
