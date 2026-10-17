import { useEffect, useState } from 'react';
import { api } from './api';
import { validateMember } from './validators';
import Field from './Field.jsx';

const empty = { name: '', email: '', phone: '' };

export default function Members({ notify }) {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);

  const load = async () => {
    try { setMembers(await api.get('/members')); }
    catch (e) { notify(e.message, true); }
  };
  useEffect(() => { load(); }, []);

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    const errs = validateMember(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      if (editId) await api.put('/members/' + editId, form);
      else await api.post('/members', form);
      notify(editId ? 'Member updated' : 'Member added');
      setForm(empty); setEditId(null); load();
    } catch (err) { notify(err.message, true); }
  };

  const edit = m => {
    setEditId(m._id);
    setForm({ name: m.name, email: m.email, phone: m.phone });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async m => {
    if (!confirm(`Delete member "${m.name}"?`)) return;
    try { await api.del('/members/' + m._id); notify('Member deleted'); load(); }
    catch (err) { notify(err.message, true); }
  };

  return (
    <section>
      <form className="card grid" onSubmit={submit} noValidate>
        <h2>{editId ? 'Edit member' : 'Add member'}</h2>
        <Field label="Name" value={form.name} onChange={set('name')} error={errors.name} />
        <Field label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
        <Field label="Phone (10 digits)" value={form.phone} maxLength={10} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} error={errors.phone} />
        <div className="actions">
          <button type="submit">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" className="ghost" onClick={() => { setEditId(null); setForm(empty); setErrors({}); }}>Cancel</button>}
        </div>
      </form>

      <div className="card">
        <h2>Members ({members.length})</h2>
        <div className="scroll">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th></th></tr></thead>
            <tbody>
              {members.map(m => (
                <tr key={m._id}>
                  <td>{m.name}</td><td>{m.email}</td><td>{m.phone}</td>
                  <td className="row-actions">
                    <button className="ghost" onClick={() => edit(m)}>Edit</button>
                    <button className="danger" onClick={() => remove(m)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!members.length && <tr><td colSpan="4" className="empty">No members yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
