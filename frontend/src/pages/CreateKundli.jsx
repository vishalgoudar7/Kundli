import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import KundliForm from '../components/KundliForm.jsx';
import { createKundli } from '../services/kundliApi.js';
export default function CreateKundli() {
  const navigate = useNavigate(); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  const submit = async form => { setLoading(true); setError(''); try { const kundli = await createKundli(form); navigate(`/kundli/${kundli._id}`); } catch (err) { setError(err.response?.data?.message || err.message || 'Unable to generate your Kundli.'); } finally { setLoading(false); } };
  return <main className="form-page"><Link className="back-link" to="/dashboard"><ArrowLeft size={17}/> Back to My Kundlis</Link><div className="form-page-heading"><small>CREATE KUNDLI</small><h1>Your cosmic blueprint,<br/><i>beautifully revealed.</i></h1><p>Enter the precise birth details below to generate and save a Vedic chart.</p></div><KundliForm onSubmit={submit} loading={loading} />{error && <div className="error" role="alert">{error}</div>}</main>;
}
