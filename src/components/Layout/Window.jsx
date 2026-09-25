import WindowTitleBar from './WindowTitleBar.jsx';

/**
 * Window wraps a section of the app so it visually reads as a retro desktop
 * application window (title bar with dot controls + a scrollable content
 * area). Every major screen (Books, Members, Loans, ...) is rendered inside
 * one or more of these.
 */
function Window({ title, status, onClose, children, right }) {
  return (
    <div className="win-anim border-2 border-ink bg-cream shadow-hard flex flex-col h-full">
      <WindowTitleBar title={title} status={status} onClose={onClose} right={right} />
      <div className="p-4 overflow-y-auto noscroll-x grow">{children}</div>
    </div>
  );
}

export default Window;
