import { localBirthToUTC } from '../utils/datetime.js';
import { calculateAstronomy } from '../astrology/ephemeris.js';
import { enrichPlanet, signFromLongitude } from '../astrology/vedic.js';
import { groupByHouse } from '../astrology/chart.js';
import { generateNavamsaChart } from '../astrology/navamsa.js';
import { calculatePanchanga } from '../astrology/panchanga.js';

import {
  calculateVimshottariDasha,
  getCurrentDasha
} from '../astrology/dasha.js';


export async function generateKundli(input) {

  // ------------------------------------
  // VALIDATE INPUT
  // ------------------------------------

  validate(input);


  // ------------------------------------
  // CONVERT BIRTH TIME TO UTC
  // ------------------------------------

  const utc = localBirthToUTC(
    input.date,
    input.time,
    input.timezone
  );


  // ------------------------------------
  // SETTINGS
  // ------------------------------------

  const settings = {
    zodiac: 'sidereal',

    ayanamsha:
      input.settings?.ayanamsha ||
      'lahiri',

    nodeType:
      input.settings?.nodeType ||
      'mean',

    houseSystem:
      input.settings?.houseSystem ||
      'whole-sign',

    chartStyle:
      input.settings?.chartStyle ||
      'north-indian'
  };


  // ------------------------------------
  // ASTRONOMICAL CALCULATION
  // ------------------------------------

  const astronomy =
    await calculateAstronomy({
      utc,

      latitude:
        Number(input.latitude),

      longitude:
        Number(input.longitude),

      settings
    });


  // ------------------------------------
  // LAGNA
  // ------------------------------------

  const lagnaLongitude =
    normalize(
      astronomy.ascendant
    );

  const lagnaSignIndex =
    Math.floor(
      lagnaLongitude / 30
    );

  const lagna = {
    longitude:
      lagnaLongitude,

    ...signFromLongitude(
      lagnaLongitude
    )
  };


  // ------------------------------------
  // PLANETS
  // ------------------------------------

  const planets =
    astronomy.planets.map(
      (planet) =>
        enrichPlanet(
          planet.name,
          planet.longitude,
          lagnaSignIndex
        )
    );


  // ------------------------------------
  // D1 HOUSES
  // ------------------------------------

  const houses =
    groupByHouse(
      planets,
      lagnaSignIndex
    );


  // ------------------------------------
  // NAVAMSA D9
  // ------------------------------------

  const navamsa =
    generateNavamsaChart(
      lagna.longitude,
      planets
    );


  // ------------------------------------
  // FIND MOON
  // ------------------------------------

  const moon =
    planets.find(
      (planet) =>
        planet.name === 'Moon'
    );

  if (!moon) {

    const error =
      new Error(
        'Moon position not found'
      );

    error.status = 500;

    throw error;
  }

  const sun =
    planets.find(
      (planet) =>
        planet.name === 'Sun'
    );

  if (!sun) {
    const error = new Error('Sun position not found');
    error.status = 500;
    throw error;
  }

  const panchanga = calculatePanchanga({
    sunLongitude: sun.longitude,
    moonLongitude: moon.longitude,
    utc,
    timezone: input.timezone
  });


  // ------------------------------------
  // VIMSHOTTARI DASHA
  // ------------------------------------

  const vimshottariDasha =
    calculateVimshottariDasha(
      moon.longitude,
      utc
    );


  // ------------------------------------
  // CURRENT DASHA
  // ------------------------------------

  const currentDasha =
    getCurrentDasha(
      vimshottariDasha.mahadashas,
      new Date()
    );


  // ------------------------------------
  // FINAL RESPONSE
  // ------------------------------------

  return {

    name:
      input.name.trim(),

    birth: {

      date:
        input.date,

      time:
        input.time,

      place:
        input.place.trim(),

      latitude:
        Number(
          input.latitude
        ),

      longitude:
        Number(
          input.longitude
        ),

      timezone:
        input.timezone,

      utc
    },


    settings,


    result: {

      // Swiss Ephemeris
      julianDay:
        astronomy.julianDay,

      ayanamsha:
        astronomy.ayanamsha,


      // D1 Lagna
      lagna,


      // Grahas
      planets,


      // D1 Houses
      houses,


      // D9 Navamsa
      navamsa,


      // Full Vimshottari Dasha
      dasha:
        vimshottariDasha,


      // Current Mahadasha
      // + Antardasha
      currentDasha,


      // Birth Panchanga
      panchanga,


      // Calculation engine
      calculationStatus:
        astronomy.calculationStatus
    }
  };
}


// ====================================
// VALIDATION
// ====================================

function validate(input) {

  const required = [
    'name',
    'date',
    'time',
    'place',
    'latitude',
    'longitude',
    'timezone'
  ];

  for (
    const key of required
  ) {

    if (
      input?.[key] === undefined ||
      input?.[key] === null ||
      input?.[key] === ''
    ) {

      const error =
        new Error(
          `${key} is required`
        );

      error.status = 400;

      throw error;
    }
  }
}


// ====================================
// NORMALIZE LONGITUDE
// ====================================

function normalize(value) {

  return (
    (
      Number(value) %
      360
    ) +
    360
  ) % 360;
}
