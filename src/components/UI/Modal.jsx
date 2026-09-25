import Icon from '../icons/Icon.jsx';
import Button from './Button.jsx';

export function ConfirmDialog({ open, title, body, confirmLabel = 'CONFIRM', onConfirm, onCancel, danger }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] bg-ink/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="win-anim bg-cream border-2 border-ink shadow-hardlg w-full max-w-sm">
        <div className="border-b-2 border-ink px-4 py-2 flex items-center justify-between bg-creamSoft">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest">{title}</span>
        </div>
        <div className="p-5 text-sm">{body}</div>
        <div className="flex justify-end gap-2 p-4 border-t-2 border-ink">
          <Button variant="ghost" onClick={onCancel}>
            CANCEL
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Modal({ open, title, onClose, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-ink/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className={`win-anim bg-cream border-2 border-ink shadow-hardlg w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto noscroll-x`}>
        <div className="border-b-2 border-ink px-4 py-2 flex items-center justify-between bg-creamSoft sticky top-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber border border-ink"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-mint border border-ink"></span>
            <span className="ml-2 font-mono text-[11px] font-bold uppercase tracking-widest">{title}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="focus-ring border-2 border-ink w-6 h-6 flex items-center justify-center bg-cream hover:bg-amber hover:text-cream"
          >
            <Icon name="close" className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
