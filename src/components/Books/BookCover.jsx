import { categoryColor } from '../../utils/libraryUtils.js';

function BookCover({ title, author, category, size = 'md' }) {
  const color = categoryColor(category);
  const initials = (author || '?')
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');
  const dims = size === 'sm' ? 'w-10 h-14' : 'w-16 h-24';
  return (
    <div className={`${dims} shrink-0 border-2 border-ink relative overflow-hidden shadow-hardxs`} style={{ background: color }}>
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.15) 0 4px, transparent 4px 10px)' }}
      ></div>
      <div className="absolute top-1 left-1 right-1 text-cream font-display font-bold text-[8px] leading-tight line-clamp-3">{title}</div>
      <div className="absolute bottom-1 right-1 text-cream font-mono text-[9px] font-bold bg-ink/50 px-1">{initials}</div>
    </div>
  );
}

export default BookCover;
