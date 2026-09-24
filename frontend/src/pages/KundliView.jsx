import { ArrowLeft, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import KundliResult from './KundliResult.jsx';
import { getKundli } from '../services/kundliApi.js';
export default function KundliView() {
  const { id } = useParams(); const [kundli, setKundli] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { let active = true; getKundli(id).then(data => { if (active) setKundli(data); }).catch(err => { if (active) setError(err.response?.data?.message || 'Unable to load this Kundli.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [id]);
  if (loading) return <div className="page-status">Loading your Kundli...</div>;
  if (error) return <main className="form-page"><div className="error" role="alert">{error}</div><Link className="back-link" to="/dashboard"><ArrowLeft size={17}/> Back to My Kundlis</Link></main>;
  return <><div className="result-actions"><Link to="/dashboard"><ArrowLeft size={17}/> Back to My Kundlis</Link><Link className="primary-action" to={`/kundli/${id}/edit`}><Pencil size={16}/> Edit</Link></div><KundliResult kundli={kundli} /></>;
}
