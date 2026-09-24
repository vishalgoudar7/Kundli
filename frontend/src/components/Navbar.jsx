import { LogOut, Menu, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth(); const [open, setOpen] = useState(false); const close = () => setOpen(false);
  return <header className="topbar">
    <Link className="brand" to={isAuthenticated ? '/dashboard' : '/login'} onClick={close}><span className="brand-mark">ॐ</span><span className="brand-copy"><b>Jyotish</b><small>Vedic Kundli</small></span></Link>
    <button className="menu-toggle" onClick={() => setOpen(value => !value)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
    <nav className={`app-nav ${open ? 'open' : ''}`}>{isAuthenticated ? <>
      <NavLink to="/dashboard" onClick={close}>Dashboard</NavLink><NavLink className="nav-create" to="/kundli/new" onClick={close}><Plus size={16}/> Create Kundli</NavLink>
      <span className="nav-user">{user?.name}</span><button className="logout-button" onClick={() => { close(); logout(); }}><LogOut size={16}/> Logout</button>
    </> : <><NavLink to="/login" onClick={close}>Login</NavLink><NavLink to="/register" onClick={close}>Create account</NavLink></>}</nav>
  </header>;
}
