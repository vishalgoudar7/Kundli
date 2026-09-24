import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import KundliForm from '../components/KundliForm.jsx';
import { getKundli, updateKundli } from '../services/kundliApi.js';
export default function EditKundli() {
  const { id } = useParams(); const navigate = useNavigate(); const [initial, setInitial] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  useEffect(() => { let active = true; getKundli(id).then(data => { if (active) setInitial({ name: data.name, relationship: data.relationship, date: data.birth?.date, time: data.birth?.time, place: data.birth?.place, latitude: data.birth?.latitude, longitude: data.birth?.longitude, timezone: data.birth?.timezone }); }).catch(err => { if (active) setError(err.response?.data?.message || 'Unable to load this Kundli.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [id]);
  const submit = async form => { setSaving(true); setError(''); try { const updated = await updateKundli(id, form); navigate(`/kundli/${updated._id || id}`); } catch (err) { setError(err.response?.data?.message || err.message || 'Unable to update this Kundli.'); } finally { setSaving(false); } };
  return <main className="form-page"><Link className="back-link" to={`/kundli/${id}`}><ArrowLeft size={17}/> Back to Kundli</Link><div className="form-page-heading"><small>EDIT KUNDLI</small><h1>Update birth details</h1><p>The astrology result will be recalculated when you save.</p></div>{error && <div className="error" role="alert">{error}</div>}{loading ? <div className="page-status">Loading birth details...</div> : initial && <KundliForm initialValues={initial} onSubmit={submit} loading={saving} submitLabel="Update Kundli" />}</main>;
}
