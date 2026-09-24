import {
  dateToJulianDay,
  calculatePosition,
  calculateHouses,
  setSiderealMode,
  getAyanamsaExUt,
  Planet,
  LunarPoint,
  HouseSystem,
  SiderealMode,
  CalculationFlag
} from "@swisseph/node";

const PLANETS = [
  ["Sun", Planet.Sun],
  ["Moon", Planet.Moon],
  ["Mars", Planet.Mars],
  ["Mercury", Planet.Mercury],
  ["Jupiter", Planet.Jupiter],
  ["Venus", Planet.Venus],
  ["Saturn", Planet.Saturn]
];

export async function calculateAstronomy({
  utc,
  latitude,
  longitude,
  settings
}) {
  const date = new Date(utc);

  if (Number.isNaN(date.getTime())) {
    const error = new Error("Invalid UTC birth datetime");
    error.status = 400;
    throw error;
  }

  // Convert birth time to Julian Day
  const jd = dateToJulianDay(date);

  // ------------------------------------
  // LAHIRI AYANAMSHA
  // ------------------------------------

  setSiderealMode(SiderealMode.Lahiri);

  const ayanamsha = getAyanamsaExUt(
    jd,
    CalculationFlag.SwissEphemeris
  );

  // ------------------------------------
  // SIDEREAL FLAGS
  // ------------------------------------

  const flags =
    CalculationFlag.SwissEphemeris |
    CalculationFlag.Speed |
    CalculationFlag.Sidereal;

  // ------------------------------------
  // PLANETS
  // ------------------------------------

  const planets = PLANETS.map(([name, planet]) => {
    const result = calculatePosition(
      jd,
      planet,
      flags
    );

    return {
      name,
      longitude: normalize(result.longitude),
      latitude: result.latitude,
      longitudeSpeed: result.longitudeSpeed,
      retrograde: result.longitudeSpeed < 0
    };
  });

  // ------------------------------------
  // RAHU
  // ------------------------------------

  const rahuResult = calculatePosition(
    jd,
    LunarPoint.MeanNode,
    flags
  );

  const rahuLongitude = normalize(
    rahuResult.longitude
  );

  planets.push({
    name: "Rahu",
    longitude: rahuLongitude,
    latitude: rahuResult.latitude,
    longitudeSpeed: rahuResult.longitudeSpeed,
    retrograde: rahuResult.longitudeSpeed < 0
  });

  // ------------------------------------
  // KETU
  // Ketu is exactly opposite Rahu
  // ------------------------------------

  planets.push({
    name: "Ketu",
    longitude: normalize(
      rahuLongitude + 180
    ),
    latitude: -rahuResult.latitude,
    longitudeSpeed: rahuResult.longitudeSpeed,
    retrograde: rahuResult.longitudeSpeed < 0
  });

  // ------------------------------------
  // TROPICAL ASCENDANT
  // ------------------------------------

  const houses = calculateHouses(
    jd,
    Number(latitude),
    Number(longitude),
    HouseSystem.WholeSign
  );

  /*
   * calculateHouses() gives us the tropical
   * ascendant here.
   *
   * Convert it to Lahiri sidereal longitude.
   */

  const siderealAscendant = normalize(
    houses.ascendant - ayanamsha
  );

  return {
    julianDay: jd,

    ayanamsha: {
      type: "Lahiri",
      value: ayanamsha
    },

    ascendant: siderealAscendant,

    planets,

    calculationStatus:
      "sidereal-lahiri-swiss-ephemeris",

    settings
  };
}

function normalize(value) {
  return (
    (Number(value) % 360) + 360
  ) % 360;
}