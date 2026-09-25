import Icon from '../icons/Icon.jsx';

function DesktopIcon({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="focus-ring flex flex-col items-center gap-1.5 p-2 hover:bg-mint/30 border-2 border-transparent hover:border-ink transition-all active:scale-95 cursor-pointer"
    >
      <div className="w-10 h-10 border-2 border-ink bg-cream flex items-center justify-center shadow-hardxs group-hover:bg-mint">
        <Icon name={icon} className="w-4 h-4 text-ink" />
      </div>
      <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-center leading-tight">{label}</span>
    </button>
  );
}

export default DesktopIcon;
