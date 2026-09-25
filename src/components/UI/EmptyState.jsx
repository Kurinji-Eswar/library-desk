import Icon from '../icons/Icon.jsx';

function EmptyState({ title, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 border-2 border-dashed border-grayish/60 bg-creamSoft/40">
      <div className="w-12 h-12 mb-3 border-2 border-ink rounded-full flex items-center justify-center bg-cream">
        <Icon name="x-circle" className="w-6 h-6" />
      </div>
      <div className="font-display font-bold text-sm uppercase tracking-wide mb-1">{title}</div>
      <div className="text-sm text-grayish max-w-xs mb-4">{body}</div>
      {action}
    </div>
  );
}

export default EmptyState;
