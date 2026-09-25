import Icon from '../icons/Icon.jsx';
import Badge from '../UI/Badge.jsx';

function WindowTitleBar({ title, status, onClose, right }) {
  return (
    <div className="border-b-2 border-ink px-3 py-2 flex items-center justify-between bg-creamSoft shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2.5 h-2.5 rounded-full bg-amber border border-ink shrink-0"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-mint border border-ink shrink-0"></span>
        <span className="ml-2 font-mono text-[11px] font-bold uppercase tracking-widest truncate">{title}</span>
        {status && (
          <span className="hidden sm:inline-block ml-2">
            <Badge>{status}</Badge>
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {right}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close window"
            className="focus-ring border-2 border-ink w-6 h-6 flex items-center justify-center bg-cream hover:bg-amber hover:text-cream"
          >
            <Icon name="close" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default WindowTitleBar;
