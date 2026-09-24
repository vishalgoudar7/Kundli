import { CalendarDays, Clock3, MapPin, Sparkles, UserRound, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
const defaults = { name: '', relationship: 'self', date: '', time: '', place: 'Belagavi, Karnataka, India', latitude: '15.8497', longitude: '74.4977', timezone: 'Asia/Kolkata' };
const relationships = ['self','partner','father','mother','brother','sister','child','friend','other'];
export default function KundliForm({ initialValues, onSubmit, loading, submitLabel = 'Generate My Kundli' }) {
  const [form, setForm] = useState({ ...defaults, ...initialValues });
  useEffect(() => { if (initialValues) setForm({ ...defaults, ...initialValues }); }, [initialValues]);
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  return <form className="birth-card" onSubmit={event => { event.preventDefault(); onSubmit(form); }}>
    <div className="form-heading"><span><Sparkles size={20}/></span><div><h2>Birth Details</h2><p>Use the exact time and place of birth for an accurate chart.</p></div></div>
    <div className="form-grid">
      <label><span><UserRound size={15}/> Full name</span><input name="name" value={form.name} onChange={change} required placeholder="e.g. Vishal Gouda" /></label>
      <label><span><Users size={15}/> Relationship</span><select name="relationship" value={form.relationship} onChange={change}>{relationships.map(value => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label>
      <label><span><CalendarDays size={15}/> Date of birth</span><input type="date" name="date" value={form.date} onChange={change} required /></label>
      <label><span><Clock3 size={15}/> Time of birth</span><input type="time" name="time" value={form.time} onChange={change} required /></label>
      <label className="place-field"><span><MapPin size={15}/> Birth place</span><input name="place" value={form.place} onChange={change} required /></label>
    </div>
    <details className="coordinates"><summary>Advanced location settings</summary><div className="advanced-grid">
      <label><span>Latitude</span><input type="number" step="any" name="latitude" value={form.latitude} onChange={change} required /></label>
      <label><span>Longitude</span><input type="number" step="any" name="longitude" value={form.longitude} onChange={change} required /></label>
      <label><span>Timezone</span><input name="timezone" value={form.timezone} onChange={change} required /></label>
    </div></details>
    <button className="submit-button" disabled={loading}>{loading ? `${submitLabel.replace(/ Kundli$/,'')}...` : submitLabel}<span>→</span></button>
  </form>;
}
