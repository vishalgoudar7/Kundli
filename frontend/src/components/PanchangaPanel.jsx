import { CalendarDays, CircleDot, MoonStar, Sparkles, SunMedium } from 'lucide-react';
import { useEffect } from 'react';

const formatPercent = value => Number.isFinite(Number(value)) ? `${Math.round(Number(value))}% complete` : null;

export default function PanchangaPanel({ panchanga }) {
  useEffect(() => {
    const button = document.querySelector('.sidebar nav button:nth-child(4)');
    if (!button) return undefined;
    const openPanchanga = () => document.getElementById('panchanga')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    button.addEventListener('click', openPanchanga);
    button.classList.add('available');
    return () => { button.removeEventListener('click', openPanchanga); button.classList.remove('available'); };
  }, []);

  if (!panchanga) return <section className="panel panchanga-panel" id="panchanga"><div className="panchanga-heading"><div><small>BIRTH PANCHANGA</small><h2>Panchanga</h2></div></div><div className="panchanga-unavailable"><MoonStar size={28}/><h3>Panchanga is not available for this saved Kundli.</h3><p>Edit and save the birth details to recalculate it with the latest astrology engine.</p></div></section>;

  const cards = [
    { label: 'Vara', Icon: CalendarDays, value: panchanga.vara?.name, detail: panchanga.vara?.traditionalName },
    { label: 'Tithi', Icon: MoonStar, value: panchanga.tithi?.name, detail: panchanga.tithi?.paksha, progress: formatPercent(panchanga.tithi?.percentage) },
    { label: 'Nakshatra', Icon: Sparkles, value: panchanga.nakshatra?.name, detail: panchanga.nakshatra?.pada ? `Pada ${panchanga.nakshatra.pada}` : null, progress: formatPercent(panchanga.nakshatra?.percentage) },
    { label: 'Yoga', Icon: SunMedium, value: panchanga.yoga?.name, detail: panchanga.yoga?.number ? `Yoga ${panchanga.yoga.number} of 27` : null, progress: formatPercent(panchanga.yoga?.percentage) },
    { label: 'Karana', Icon: CircleDot, value: panchanga.karana?.name, detail: panchanga.karana?.type ? `${panchanga.karana.type} Karana` : null, progress: formatPercent(panchanga.karana?.percentage) }
  ];

  return <section className="panel panchanga-panel" id="panchanga">
    <div className="panchanga-heading"><div><small>BIRTH PANCHANGA</small><h2>Panchanga</h2><p>Five limbs calculated for the birth moment</p></div><span>Civil Vara</span></div>
    <div className="panchanga-cards">{cards.map(({ label, Icon, value, detail, progress }) => <article className="panchanga-card" key={label}><div className="panchanga-icon"><Icon size={20}/></div><small>{label}</small><strong>{value || '—'}</strong>{detail && <span>{detail}</span>}{progress && <em>{progress}</em>}</article>)}</div>
    <p className="vara-note">Vara uses the civil weekday in the supplied birth timezone. Sunrise-based Vara is not included yet.</p>
  </section>;
}
