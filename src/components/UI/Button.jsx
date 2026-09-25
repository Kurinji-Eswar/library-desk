function Button({ children, variant = 'default', className = '', ...rest }) {
  const base =
    'inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wide border-2 border-ink transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-ring disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    default: 'bg-creamSoft text-ink shadow-hardsm hover:bg-mint',
    primary: 'bg-blue text-cream shadow-hardsm hover:brightness-110',
    mint: 'bg-mint text-ink shadow-hardsm hover:brightness-105',
    danger: 'bg-cream text-ink shadow-hardsm hover:bg-amber hover:text-cream',
    ghost: 'bg-transparent border-transparent shadow-none hover:bg-creamSoft',
    dark: 'bg-ink text-cream shadow-hardsm hover:brightness-125',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;
