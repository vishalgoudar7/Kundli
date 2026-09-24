import { CalendarDays, Clock3, Eye, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteKundli, getKundlis } from '../services/kundliApi.js';
const formatDate = value => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const formatCreated = value => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export default function Dashboard() {
  const { user } = useAuth(); const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [deleting, setDeleting] = useState('');
  useEffect(() => { let active = true; getKundlis().then(data => { if (active) setItems(data); }).catch(err => { if (active) setError(err.response?.data?.message || 'Unable to load your Kundlis.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const remove = async item => { if (!window.confirm(`Delete ${item.name}'s Kundli? This action cannot be undone.`)) return; setDeleting(item._id); setError(''); try { await deleteKundli(item._id); setItems(current => current.filter(entry => entry._id !== item._id)); } catch (err) { setError(err.response?.data?.message || 'Unable to delete this Kundli.'); } finally { setDeleting(''); } };
  return <main className="listing-page"><section className="page-heading"><div><small>JYOTISH · VEDIC KUNDLI</small><h1>Welcome, {user?.name?.split(' ')[0]}</h1><p>Your saved birth charts, gathered in one place.</p></div><Link className="primary-action" to="/kundli/new"><Plus size={18}/> Create Kundli</Link></section>
    <div className="section-title"><div><h2>My Kundlis</h2><p>{items.length} {items.length === 1 ? 'chart' : 'charts'} saved</p></div></div>
    {error && <div className="error" role="alert">{error}</div>}{loading ? <div className="page-status">Loading your Kundlis...</div> : items.length === 0 ? <section className="empty-state"><div>✦</div><h2>You haven't created any Kundlis yet.</h2><p>Create your first chart to explore planetary positions, Dashas, and more.</p><Link className="primary-action" to="/kundli/new"><Plus size={18}/> Create Your First Kundli</Link></section> : <div className="kundli-grid">{items.map(item => <article className="kundli-card" key={item._id}>
      <div className="card-top"><div className="card-monogram">{item.name?.charAt(0)?.toUpperCase()}</div><div><h3>{item.name}</h3><span className="relationship-badge">{item.relationship || 'self'}</span></div></div>
      <div className="birth-summary"><span><CalendarDays/> {formatDate(item.birth?.date)}</span><span><Clock3/> {item.birth?.time || '—'}</span><span><MapPin/> {item.birth?.place || '—'}</span></div>
      <small className="created-date">Created {formatCreated(item.createdAt)}</small><div className="card-actions"><Link to={`/kundli/${item._id}`}><Eye size={16}/> View</Link><Link to={`/kundli/${item._id}/edit`}><Pencil size={16}/> Edit</Link><button onClick={() => remove(item)} disabled={deleting === item._id}><Trash2 size={16}/> {deleting === item._id ? 'Deleting...' : 'Delete'}</button></div>
    </article>)}</div>}
  </main>;
}
