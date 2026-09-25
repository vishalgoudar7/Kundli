import { Apple, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
export default function LoginForm({ form, setForm, onSubmit, loading, error, successMessage }) {
  const [showPassword, setShowPassword] = useState(false);
  return <section className="split-login-card"><div className="split-auth-symbol">ॐ</div><small>WELCOME BACK</small><h2>Sign in to Jyotish</h2><p>Continue your journey through the stars.</p>
    {successMessage && <div className="success-message">{successMessage}</div>}{error && <div className="error" role="alert">{error}</div>}
    <form onSubmit={onSubmit}><label>Email<div className="login-input"><Mail size={16}/><input type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} required autoComplete="email" placeholder="Enter your email address" /></div></label>
      <label><span className="password-label">Password <button type="button">Forgot password?</button></span><div className="login-input"><LockKeyhole size={16}/><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} required autoComplete="current-password" placeholder="Enter your password" /><button type="button" className="password-toggle" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></label>
      <button className="split-signin" disabled={loading}>{loading ? 'Signing in...' : <>Sign In <span>→</span></>}</button>
    </form>
    <div className="login-divider"><span>OR CONTINUE WITH</span></div><div className="social-buttons"><button type="button"><b>G</b> Continue with Google</button><button type="button"><Apple size={16}/> Continue with Apple</button></div>
    <p className="split-auth-switch">Don't have an account? <Link to="/register">Create account</Link></p>
  </section>;
}
