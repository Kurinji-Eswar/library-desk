export const inputCls = 'w-full border-2 border-ink bg-cream px-3 py-2 text-sm font-sans focus-ring outline-none placeholder:text-grayish';

function Input(props) {
  return <input {...props} className={`${inputCls} ${props.className || ''}`} />;
}

export function Field({ label, children, required }) {
  return (
    <label className="block mb-3">
      <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-grayish mb-1">
        {label}
        {required && <span className="text-amber"> *</span>}
      </span>
      {children}
    </label>
  );
}

export default Input;
