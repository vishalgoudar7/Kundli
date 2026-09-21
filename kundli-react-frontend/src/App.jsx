import { useState } from 'react';
import { Moon, Sparkles, Sun, UserRound } from 'lucide-react';
import BirthForm from './components/BirthForm.jsx';
import KundliResult from './pages/KundliResult.jsx';
import { generateKundli } from './services/kundliApi.js';

export default function App() {
  const [data, setData] = useState(null), [loading, setLoading] = useState(false), [error, setError] = useState('');
  const submit = async form => { try { setLoading(true); setError(''); setData(await generateKundli(form)); } catch(e) { setError(e.response?.data?.message || e.message || 'Unable to generate your Kundli. Please try again.'); } finally { setLoading(false); } };
  return <div className="app-shell">
    <header className="topbar"><button className="brand" onClick={()=>setData(null)} aria-label="Jyotish home"><span className="brand-mark">ॐ</span><span className="brand-copy"><b>Jyotish</b><small>Vedic Kundli</small></span></button><nav className="topnav" aria-label="Main navigation">{['Home','Kundli','Reports','Learn','About'].map((item,index)=><button key={item} className={index===0?'active':''}>{item}</button>)}</nav><div className="header-actions"><button className="icon-button" aria-label="Toggle theme"><Sun size={18}/><Moon size={16}/></button><button className="profile-button" aria-label="Profile"><UserRound size={18}/></button><button className="generate-button" onClick={()=>setData(null)}><Sparkles size={16}/> Generate New</button></div></header>
    {!data ? <main className="entry-page"><div className="hero"><small>VEDIC ASTROLOGY</small><h1>Your cosmic blueprint,<br/><i>beautifully revealed.</i></h1><p>Enter your birth details to explore your Rashi chart, Navamsa, planetary positions, and Vimshottari Dasha.</p></div><BirthForm onSubmit={submit} loading={loading}/>{error&&<div className="error" role="alert">{error}</div>}</main> : <KundliResult kundli={data}/>} 
  </div>;
}
