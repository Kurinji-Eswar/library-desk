import Icon from '../icons/Icon.jsx';

function ToastStack({ toasts, onDismiss }) {
  return (
    <div
      className="fixed top-16 right-3 z-[80] flex flex-col gap-2 w-[calc(100%-1.5rem)] max-w-xs"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-anim border-2 border-ink shadow-hardsm px-3 py-2 bg-cream flex items-start gap-2 ${t.tone === 'error' ? 'border-amber' : ''}`}
        >
          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${t.tone === 'error' ? 'bg-amber' : t.tone === 'success' ? 'bg-mint' : 'bg-blue'}`}></div>
          <div className="min-w-0">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest">{t.title}</div>
            <div className="text-xs text-ink/80 truncate">{t.body}</div>
          </div>
          <button onClick={() => onDismiss(t.id)} aria-label="Dismiss notification" className="ml-auto focus-ring">
            <Icon name="close" className="w-3 h-3 text-grayish" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastStack;
