import RashiCard from './RashiCard.jsx';
import { rashis } from '../data/rashis.js';
export default function DailyHoroscope({ selectedRashi, onSelectRashi }) {
  return <section className="daily-horoscope"><small>DAILY HOROSCOPE</small><h1>Today's Horoscope</h1><p>Select your Rashi to view today's prediction.</p>
    <div className="rashi-grid">{rashis.map(rashi => <RashiCard key={rashi.name} rashi={rashi} selected={selectedRashi === rashi.name} onSelect={onSelectRashi} />)}</div>
  </section>;
}
