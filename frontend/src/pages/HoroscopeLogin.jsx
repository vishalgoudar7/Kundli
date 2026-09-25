import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DailyHoroscope from '../components/DailyHoroscope.jsx';
import LoginForm from '../components/LoginForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
const messageFor = error => error.response?.data?.message || error.message || 'Unable to sign in. Please try again.';
export default function HoroscopeLogin() {
  const { login } = useAuth(); const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' }); const [selectedRashi, setSelectedRashi] = useState('Mesha'); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async event => { event.preventDefault(); setError(''); setLoading(true); try { await login(form); } catch (err) { setError(messageFor(err)); } finally { setLoading(false); } };
  return <main className="horoscope-login-page"><div className="horoscope-overlay"/><DailyHoroscope selectedRashi={selectedRashi} onSelectRashi={setSelectedRashi} /><aside className="login-panel-wrap"><LoginForm form={form} setForm={setForm} onSubmit={submit} loading={loading} error={error} successMessage={location.state?.message} /></aside></main>;
}
