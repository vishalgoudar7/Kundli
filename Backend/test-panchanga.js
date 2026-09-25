import assert from 'node:assert/strict';
import {
  calculateKarana, calculateNakshatra, calculatePanchanga,
  calculateTithi, calculateYoga, normalizeAngle
} from './src/astrology/panchanga.js';

const closeTo = (actual, expected, tolerance = 0.000001) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not close to ${expected}`);

assert.equal(normalizeAngle(-1), 359);
assert.equal(normalizeAngle(360), 0);
assert.equal(calculateTithi(0, 0).name, 'Pratipada');
assert.equal(calculateTithi(0, 12).name, 'Dwitiya');
assert.equal(calculateTithi(0, 179.999).name, 'Purnima');
assert.equal(calculateTithi(0, 180).paksha, 'Krishna Paksha');
assert.equal(calculateTithi(0, 348).name, 'Amavasya');

assert.equal(calculateNakshatra(0).name, 'Ashwini');
assert.equal(calculateNakshatra(13 + 1 / 3 + 1e-9).name, 'Bharani');
assert.equal(calculateNakshatra(10 / 3 + 1e-9).pada, 2);
const sampleNakshatra = calculateNakshatra(260.07467);
assert.equal(sampleNakshatra.name, 'Purva Ashadha');
assert.equal(sampleNakshatra.pada, 3);

assert.equal(calculateYoga(0, 0).name, 'Vishkambha');
assert.equal(calculateYoga(10, 10).name, 'Priti');

assert.deepEqual(calculateKarana(0, 0), { number: 1, name: 'Kimstughna', type: 'fixed', degreeProgress: 0, percentage: 0 });
assert.equal(calculateKarana(0, 6).name, 'Bava');
assert.equal(calculateKarana(0, 48).name, 'Bava');
assert.equal(calculateKarana(0, 342).name, 'Shakuni');
assert.equal(calculateKarana(0, 348).name, 'Chatushpada');
assert.equal(calculateKarana(0, 354).name, 'Naga');

const sample = calculatePanchanga({ sunLongitude: 57, moonLongitude: 260.07467, utc: '1998-06-12T02:40:00.000Z', timezone: 'Asia/Kolkata' });
assert.equal(sample.vara.name, 'Friday');
assert.equal(sample.vara.traditionalName, 'Shukravara');
assert.equal(sample.nakshatra.name, 'Purva Ashadha');
assert.equal(sample.nakshatra.pada, 3);
closeTo(sample.nakshatra.degreeInNakshatra, 6.741337, 0.00001);

console.log('Panchanga tests passed');
