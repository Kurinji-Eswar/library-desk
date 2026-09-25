import Icon from '../icons/Icon.jsx';

function DesktopIcon({ label, icon, onClick }) {
  return (
    <button onClick={onClick} className="focus-ring flex flex-col items-center gap-1.5 p-2 hover:bg-creamSoft border-2 border-transparent hover:border-ink">
      <div className="w-9 h-9 border-2 border-ink bg-creamSoft flex items-center justify-center shadow-hardxs">
        <Icon name={icon} className="w-4 h-4" />
      </div>
      <span className="text-[9px] font-mono font-bold uppercase tracking-wide text-center">{label}</span>
    </button>
  );
}

export default DesktopIcon;
