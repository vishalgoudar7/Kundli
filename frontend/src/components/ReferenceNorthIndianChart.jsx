import { ExternalLink } from 'lucide-react';

const signNumbers = {
  Aries: 1, Taurus: 2, Gemini: 3, Cancer: 4, Leo: 5, Virgo: 6,
  Libra: 7, Scorpio: 8, Sagittarius: 9, Capricorn: 10, Aquarius: 11, Pisces: 12
};
const abbreviations = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju',
  Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke', Uranus: 'Ur',
  Neptune: 'Ne', Pluto: 'Pl'
};
const planetClasses = {
  Sun: 'sun', Moon: 'moon', Mars: 'mars', Mercury: 'mercury', Jupiter: 'jupiter',
  Venus: 'venus', Saturn: 'saturn', Rahu: 'node', Ketu: 'ketu', Uranus: 'uranus',
  Neptune: 'node', Pluto: 'node'
};

export default function ReferenceNorthIndianChart({ title, subtitle, houses = [] }) {
  const getHouse = number => houses.find(house => Number(house.house) === number) || {};
  return <section className="panel chart-panel">
    <div className="panel-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><button>View Details <ExternalLink size={13}/></button></div>
    <div className="reference-chart">
      <svg className="reference-chart-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0L50 50L100 0M0 100L50 50L100 100M50 0L100 50L50 100L0 50Z" />
      </svg>
      {[1,2,3,4,5,6,7,8,9,10,11,12].map(number => {
        const house = getHouse(number);
        return <div className={`reference-house rh${number}`} key={number}>
          <b>{house.signIndex != null ? Number(house.signIndex) + 1 : signNumbers[house.sign] || number}</b>
          <div className="chart-planets">{(house.planets || []).map(planet => <span className={planetClasses[planet] || 'node'} key={planet} title={planet}>{abbreviations[planet] || planet.slice(0, 2)}</span>)}</div>
        </div>;
      })}
    </div>
  </section>;
}
