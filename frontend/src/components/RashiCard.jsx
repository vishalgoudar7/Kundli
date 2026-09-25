export default function RashiCard({ rashi, selected, onSelect }) {
  return <button type="button" className={`rashi-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(rashi.name)} aria-pressed={selected}>
    <span className="rashi-identity"><img src={rashi.icon} alt="" aria-hidden="true" /><strong>{rashi.name}</strong></span>
    <span className="rashi-prediction">{rashi.prediction}</span>
  </button>;
}
