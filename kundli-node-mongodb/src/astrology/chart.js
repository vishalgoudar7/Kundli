const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

export function groupByHouse(planets, lagnaSignIndex) {
  return Array.from({ length: 12 }, (_, i) => {
    const house = i + 1;
    const signIndex = (lagnaSignIndex + i) % 12;
    return {
      house,
      sign: SIGNS[signIndex],
      signIndex,
      planets: planets.filter((p) => p.house === house).map((p) => p.name)
    };
  });
}
