import { useEffect, useState } from 'react';
import { api } from './api';
import { validateBook } from './validators';
import Field from './Field.jsx';

const empty = { title: '', author: '', isbn: '', category: '', totalCopies: 1 };

export default function Books({ notify }) {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [q, setQ] = useState('');

  const load = async (query = q) => {
    try { setBooks(await api.get('/books?q=' + encodeURIComponent(query))); }
    catch (e) { notify(e.message, true); }
  };
  useEffect(() => { load(''); }, []);

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    const errs = validateBook(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const payload = { ...form, totalCopies: Number(form.totalCopies) };
    try {
      if (editId) await api.put('/books/' + editId, payload);
      else await api.post('/books', payload);
      notify(editId ? 'Book updated' : 'Book added');
      setForm(empty); setEditId(null); load();
    } catch (err) { notify(err.message, true); }
  };

  const edit = b => {
    setEditId(b._id);
    setForm({ title: b.title, author: b.author, isbn: b.isbn, category: b.category, totalCopies: b.totalCopies });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async b => {
    if (!confirm(`Delete "${b.title}"?`)) return;
    try { await api.del('/books/' + b._id); notify('Book deleted'); load(); }
    catch (err) { notify(err.message, true); }
  };

  return (
    <section>
      <form className="card grid" onSubmit={submit} noValidate>
        <h2>{editId ? 'Edit book' : 'Add book'}</h2>
        <Field label="Title" value={form.title} onChange={set('title')} error={errors.title} />
        <Field label="Author" value={form.author} onChange={set('author')} error={errors.author} />
        <Field label="ISBN (10 or 13 digits)" value={form.isbn} onChange={set('isbn')} error={errors.isbn} />
        <Field label="Category" value={form.category} onChange={set('category')} error={errors.category} />
        <Field label="Total copies" type="number" min="1" value={form.totalCopies} onChange={set('totalCopies')} error={errors.totalCopies} />
        <div className="actions">
          <button type="submit">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" className="ghost" onClick={() => { setEditId(null); setForm(empty); setErrors({}); }}>Cancel</button>}
        </div>
      </form>

      <div className="card">
        <div className="bar">
          <h2>Books ({books.length})</h2>
          <input placeholder="Search title, author, ISBN..." value={q} onChange={e => { setQ(e.target.value); load(e.target.value); }} />
        </div>
        <div className="scroll">
          <table>
            <thead><tr><th>Title</th><th>Author</th><th>ISBN</th><th>Category</th><th>Available</th><th></th></tr></thead>
            <tbody>
              {books.map(b => (
                <tr key={b._id}>
                  <td>{b.title}</td><td>{b.author}</td><td>{b.isbn}</td><td>{b.category}</td>
                  <td>{b.availableCopies} / {b.totalCopies}</td>
                  <td className="row-actions">
                    <button className="ghost" onClick={() => edit(b)}>Edit</button>
                    <button className="danger" onClick={() => remove(b)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!books.length && <tr><td colSpan="6" className="empty">No books found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
