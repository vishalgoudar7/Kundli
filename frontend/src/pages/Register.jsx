import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
export default function Register() {
  const { register } = useAuth(); const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' }); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async event => { event.preventDefault(); setError(''); if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; } setLoading(true); try { await register({ name: form.name, email: form.email, password: form.password }); } catch (err) { setError(err.response?.data?.message || err.message || 'Unable to create your account.'); } finally { setLoading(false); } };
  return <main className="auth-page"><section className="auth-card"><div className="auth-symbol">ॐ</div><small>BEGIN YOUR JOURNEY</small><h1>Create your account</h1><p>Save and revisit your Vedic charts securely.</p>{error && <div className="error" role="alert">{error}</div>}
    <form onSubmit={submit}><label>Full Name<input name="name" value={form.name} onChange={change} required autoComplete="name" /></label><label>Email<input type="email" name="email" value={form.email} onChange={change} required autoComplete="email" /></label><label>Password<input type="password" name="password" minLength="8" value={form.password} onChange={change} required autoComplete="new-password" /></label><label>Confirm Password<input type="password" name="confirmPassword" minLength="8" value={form.confirmPassword} onChange={change} required autoComplete="new-password" /></label><button className="submit-button" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button></form>
    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></section></main>;
}
