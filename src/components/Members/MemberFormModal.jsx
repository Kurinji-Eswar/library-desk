import { useState } from 'react';
import Modal from '../UI/Modal.jsx';
import Button from '../UI/Button.jsx';
import Select from '../UI/Select.jsx';
import Input, { Field } from '../UI/Input.jsx';
import Icon from '../icons/Icon.jsx';
import { useLibrary } from '../../context/LibraryContext.jsx';

function MemberFormModal({ member, onClose }) {
  const { addMember, editMember } = useLibrary();
  const [form, setForm] = useState(
    member
      ? { name: member.name, email: member.email, phone: member.phone, address: member.address, membershipType: member.membershipType }
      : { name: '', email: '', phone: '', address: '', membershipType: 'Standard' }
  );
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email.';
    if (!form.phone.trim()) e.phone = 'Phone is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const ok = member ? (editMember(member.id, form), true) : addMember(form);
    if (ok) onClose();
  };

  return (
    <Modal open title={member ? `EDIT MEMBER — ${member.id}` : 'ADD MEMBER'} onClose={onClose} wide>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <Field label="Full Name" required>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <p className="text-amber text-xs mt-1">{errors.name}</p>}
        </Field>
        <Field label="Email" required>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <p className="text-amber text-xs mt-1">{errors.email}</p>}
        </Field>
        <Field label="Phone" required>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          {errors.phone && <p className="text-amber text-xs mt-1">{errors.phone}</p>}
        </Field>
        <Field label="Membership Type">
          <Select value={form.membershipType} onChange={(e) => setForm({ ...form, membershipType: e.target.value })}>
            <option value="Standard">STANDARD</option>
            <option value="Premium">PREMIUM</option>
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Address">
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t-2 border-ink">
        <Button variant="ghost" onClick={onClose}>
          CANCEL
        </Button>
        <Button variant="primary" onClick={submit}>
          <Icon name="check" className="w-3.5 h-3.5" />
          SAVE MEMBER
        </Button>
      </div>
    </Modal>
  );
}

export default MemberFormModal;
