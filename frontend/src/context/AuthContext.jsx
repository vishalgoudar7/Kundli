import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, loginUser, registerUser } from '../services/authApi.js';
const AuthContext = createContext(null);
const TOKEN_KEY = 'kundli_token';
const USER_KEY = 'kundli_user';
export function AuthProvider({ children }) {
  const navigate = useNavigate(); const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY)); const [loading, setLoading] = useState(true);
  const clearSession = useCallback(() => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setToken(null); setUser(null); }, []);
  const saveSession = useCallback(data => { localStorage.setItem(TOKEN_KEY, data.token); localStorage.setItem(USER_KEY, JSON.stringify(data.user)); setToken(data.token); setUser(data.user); }, []);
  const refreshUser = useCallback(async () => { const data = await getMe(); setUser(data.user); localStorage.setItem(USER_KEY, JSON.stringify(data.user)); return data.user; }, []);
  useEffect(() => {
    let active = true;
    (async () => { if (!localStorage.getItem(TOKEN_KEY)) { setLoading(false); return; } try { const data = await getMe(); if (active) setUser(data.user); } catch { if (active) clearSession(); } finally { if (active) setLoading(false); } })();
    const unauthorized = () => { clearSession(); navigate('/login', { replace: true }); };
    window.addEventListener('auth:unauthorized', unauthorized);
    return () => { active = false; window.removeEventListener('auth:unauthorized', unauthorized); };
  }, [clearSession, navigate]);
  const login = async credentials => { const data = await loginUser(credentials); saveSession(data); navigate('/dashboard'); return data; };
  const register = async details => { const data = await registerUser(details); if (data.token && data.user) { saveSession(data); navigate('/dashboard'); } else navigate('/login', { state: { message: 'Account created. Please sign in.' } }); return data; };
  const logout = () => { clearSession(); navigate('/login', { replace: true }); };
  const value = useMemo(() => ({ user, token, loading, isAuthenticated: Boolean(token && user), login, register, logout, refreshUser }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
