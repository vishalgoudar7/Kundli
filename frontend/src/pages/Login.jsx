import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
const messageFor = error => error.response?.data?.message || error.message || 'Unable to sign in. Please try again.';
export default function Login() {
  const { login } = useAuth(); const location = useLocation(); const [form, setForm] = useState({ email: '', password: '' }); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async event => { event.preventDefault(); setError(''); setLoading(true); try { await login(form); } catch (err) { setError(messageFor(err)); } finally { setLoading(false); } };
  return <main className="auth-page"><section className="auth-card"><div className="auth-symbol">ॐ</div><small>WELCOME BACK</small><h1>Sign in to Jyotish</h1><p>Continue your journey through the stars.</p>
    {location.state?.message && <div className="success-message">{location.state.message}</div>}{error && <div className="error" role="alert">{error}</div>}
    <form onSubmit={submit}><label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required autoComplete="email" /></label><label>Password<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" /></label><button className="submit-button" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button></form>
    <p className="auth-switch">Don't have an account? <Link to="/register">Create account</Link></p></section></main>;
}
