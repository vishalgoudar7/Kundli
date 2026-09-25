import { DateTime } from 'luxon';
import { nakshatraFromLongitude } from './vedic.js';

const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi'
];

const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi',
  'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata',
  'Variyana', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha',
  'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
];

const MOVABLE_KARANAS = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti'];
const VARAS = [
  ['Monday', 'Somavara'], ['Tuesday', 'Mangalavara'],
  ['Wednesday', 'Budhavara'], ['Thursday', 'Guruvara'],
  ['Friday', 'Shukravara'], ['Saturday', 'Shanivara'],
  ['Sunday', 'Ravivara']
];
const NAKSHATRA_SPAN = 360 / 27;

export function normalizeAngle(value) {
  return ((Number(value) % 360) + 360) % 360;
}

const round = value => Math.round(value * 1000000) / 1000000;
const percentage = (progress, span) => round((progress / span) * 100);

export function calculateTithi(sunLongitude, moonLongitude) {
  const elongation = normalizeAngle(moonLongitude - sunLongitude);
  const index = Math.min(29, Math.floor(elongation / 12));
  const position = index % 15;
  const isShukla = index < 15;
  const name = position === 14 ? (isShukla ? 'Purnima' : 'Amavasya') : TITHI_NAMES[position];
  const degreeProgress = elongation - index * 12;
  return { number: index + 1, name, paksha: isShukla ? 'Shukla Paksha' : 'Krishna Paksha', degreeProgress: round(degreeProgress), percentage: percentage(degreeProgress, 12) };
}

export function calculateNakshatra(moonLongitude) {
  const longitude = normalizeAngle(moonLongitude);
  const existing = nakshatraFromLongitude(longitude);
  const degreeInNakshatra = longitude - existing.nakshatraIndex * NAKSHATRA_SPAN;
  return { number: existing.nakshatraIndex + 1, name: existing.nakshatra, pada: existing.pada, degreeInNakshatra: round(degreeInNakshatra), percentage: percentage(degreeInNakshatra, NAKSHATRA_SPAN) };
}

export function calculateYoga(sunLongitude, moonLongitude) {
  const longitude = normalizeAngle(sunLongitude + moonLongitude);
  const index = Math.min(26, Math.floor(longitude / NAKSHATRA_SPAN));
  const degreeInYoga = longitude - index * NAKSHATRA_SPAN;
  return { number: index + 1, name: YOGA_NAMES[index], degreeInYoga: round(degreeInYoga), percentage: percentage(degreeInYoga, NAKSHATRA_SPAN) };
}

export function calculateKarana(sunLongitude, moonLongitude) {
  const elongation = normalizeAngle(moonLongitude - sunLongitude);
  const index = Math.min(59, Math.floor(elongation / 6));
  let name;
  let type;
  if (index === 0) { name = 'Kimstughna'; type = 'fixed'; }
  else if (index === 57) { name = 'Shakuni'; type = 'fixed'; }
  else if (index === 58) { name = 'Chatushpada'; type = 'fixed'; }
  else if (index === 59) { name = 'Naga'; type = 'fixed'; }
  else { name = MOVABLE_KARANAS[(index - 1) % MOVABLE_KARANAS.length]; type = 'movable'; }
  const degreeProgress = elongation - index * 6;
  return { number: index + 1, name, type, degreeProgress: round(degreeProgress), percentage: percentage(degreeProgress, 6) };
}

export function calculateVara(utc, timezone) {
  const local = DateTime.fromISO(utc, { setZone: true }).setZone(timezone);
  if (!local.isValid) throw new Error(`Unable to calculate Vara: ${local.invalidExplanation || 'invalid datetime/timezone'}`);
  const [name, traditionalName] = VARAS[local.weekday - 1];
  return { name, traditionalName, basis: 'civil weekday at supplied birth timezone' };
}

export function calculatePanchanga({ sunLongitude, moonLongitude, utc, timezone }) {
  return {
    vara: calculateVara(utc, timezone),
    tithi: calculateTithi(sunLongitude, moonLongitude),
    nakshatra: calculateNakshatra(moonLongitude),
    yoga: calculateYoga(sunLongitude, moonLongitude),
    karana: calculateKarana(sunLongitude, moonLongitude)
  };
}
