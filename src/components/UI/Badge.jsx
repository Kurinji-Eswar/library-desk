function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-creamSoft text-ink border-ink',
    mint: 'bg-mint text-ink border-ink',
    blue: 'bg-blue text-cream border-ink',
    amber: 'bg-amber text-cream border-ink',
    dark: 'bg-ink text-cream border-ink',
  };
  return <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border-2 ${tones[tone]}`}>{children}</span>;
}

export default Badge;
