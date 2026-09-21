const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

const NAKSHATRAS = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni',
  'Uttara Phalguni','Hasta','Chitra','Swati','Vishakha',
  'Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha',
  'Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada',
  'Uttara Bhadrapada','Revati'
];

export function signFromLongitude(longitude) {
  const lon = normalize(longitude);
  const signIndex = Math.floor(lon / 30);
  return {
    sign: SIGNS[signIndex],
    signIndex,
    degreeInSign: round(lon % 30)
  };
}

export function nakshatraFromLongitude(longitude) {
  const lon = normalize(longitude);
  const span = 360 / 27;
  const index = Math.floor(lon / span);
  const within = lon - index * span;
  const pada = Math.min(4, Math.floor(within / (span / 4)) + 1);
  return {
    nakshatra: NAKSHATRAS[index],
    nakshatraIndex: index,
    pada
  };
}

export function enrichPlanet(name, longitude, lagnaSignIndex) {
  const lon = normalize(longitude);
  const sign = signFromLongitude(lon);
  const nak = nakshatraFromLongitude(lon);
  const house = ((sign.signIndex - lagnaSignIndex + 12) % 12) + 1;

  return {
    name,
    longitude: round(lon),
    ...sign,
    ...nak,
    house
  };
}

function normalize(v) {
  return ((Number(v) % 360) + 360) % 360;
}
function round(v) {
  return Math.round(v * 1000000) / 1000000;
}
