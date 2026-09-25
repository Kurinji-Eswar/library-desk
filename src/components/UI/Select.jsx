import { inputCls } from './Input.jsx';

function Select({ children, ...rest }) {
  return (
    <select {...rest} className={`${inputCls} ${rest.className || ''}`}>
      {children}
    </select>
  );
}

export default Select;
