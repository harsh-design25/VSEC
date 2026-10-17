import { useEffect, useState } from 'react';
import { api } from './api';

const fmt = d => (d ? new Date(d).toLocaleDateString() : '-');

export default function Issue({ notify }) {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [txs, setTxs] = useState([]);
  const [bookId, setBookId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [errors, setErrors] = useState({});

  const load = async () => {
    try {
      const [b, m, t] = await Promise.all([api.get('/books'), api.get('/members'), api.get('/transactions')]);
      setBooks(b); setMembers(m); setTxs(t);
    } catch (e) { notify(e.message, true); }
  };
  useEffect(() => { load(); }, []);

  const issue = async e => {
    e.preventDefault();
    const errs = {};
    if (!bookId) errs.book = 'Select a book';
    if (!memberId) errs.member = 'Select a member';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      await api.post('/transactions/issue', { bookId, memberId });
      notify('Book issued (due in 14 days)');
      setBookId(''); setMemberId(''); load();
    } catch (err) { notify(err.message, true); }
  };

  const giveBack = async t => {
    try {
      const r = await api.post('/transactions/return/' + t._id);
      notify(r.fine > 0 ? `Returned. Fine: Rs.${r.fine}` : 'Book returned');
      load();
    } catch (err) { notify(err.message, true); }
  };

  const overdue = t => !t.returnDate && new Date(t.dueDate) < new Date();

  return (
    <section>
      <form className="card grid" onSubmit={issue} noValidate>
        <h2>Issue a book</h2>
        <label className="field">
          <span>Book</span>
          <select value={bookId} onChange={e => setBookId(e.target.value)} className={errors.book ? 'invalid' : ''}>
            <option value="">-- select --</option>
            {books.map(b => (
              <option key={b._id} value={b._id} disabled={b.availableCopies < 1}>
                {b.title} ({b.availableCopies} available)
              </option>
            ))}
          </select>
          {errors.book && <small className="err">{errors.book}</small>}
        </label>
        <label className="field">
          <span>Member</span>
          <select value={memberId} onChange={e => setMemberId(e.target.value)} className={errors.member ? 'invalid' : ''}>
            <option value="">-- select --</option>
            {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
          </select>
          {errors.member && <small className="err">{errors.member}</small>}
        </label>
        <div className="actions"><button type="submit">Issue</button></div>
      </form>

      <div className="card">
        <h2>Issue / return history</h2>
        <div className="scroll">
          <table>
            <thead><tr><th>Book</th><th>Member</th><th>Issued</th><th>Due</th><th>Returned</th><th>Fine</th><th></th></tr></thead>
            <tbody>
              {txs.map(t => (
                <tr key={t._id} className={overdue(t) ? 'overdue' : ''}>
                  <td>{t.book?.title || '(deleted)'}</td>
                  <td>{t.member?.name || '(deleted)'}</td>
                  <td>{fmt(t.issueDate)}</td><td>{fmt(t.dueDate)}</td><td>{fmt(t.returnDate)}</td>
                  <td>{t.fine ? `Rs.${t.fine}` : '-'}</td>
                  <td>{!t.returnDate && <button onClick={() => giveBack(t)}>Return</button>}</td>
                </tr>
              ))}
              {!txs.length && <tr><td colSpan="7" className="empty">No transactions yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
