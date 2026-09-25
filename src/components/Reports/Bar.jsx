const COLORS = { blue: '#0789B2', mint: '#A8D8D6', amber: '#D58B62', ink: '#20201C' };

function Bar({ label, value, max, tone = 'blue' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs font-mono mb-1">
        <span className="uppercase tracking-wide">{label}</span>
        <span className="text-grayish">{value}</span>
      </div>
      <div className="h-3 border-2 border-ink bg-cream">
        <div className="h-full" style={{ width: `${pct}%`, background: COLORS[tone] }}></div>
      </div>
    </div>
  );
}

export default Bar;
