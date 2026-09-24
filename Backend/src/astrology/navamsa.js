const SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces'
];

const NAVAMSA_SIZE = 30 / 9; // 3°20'

export function calculateNavamsa(longitude) {

  const lon = normalize(longitude);

  // D1 sign
  const rashiIndex =
    Math.floor(lon / 30);

  const degreeInSign =
    lon % 30;

  // Which Navamsa inside the sign (0-8)
  const navamsaPart =
    Math.min(
      8,
      Math.floor(
        degreeInSign /
        NAVAMSA_SIZE
      )
    );

  let startingSign;

  /*
   * Movable signs:
   * Aries, Cancer, Libra, Capricorn
   *
   * Start from same sign.
   */
  if (
    [0, 3, 6, 9]
      .includes(rashiIndex)
  ) {

    startingSign =
      rashiIndex;

  }

  /*
   * Fixed signs:
   * Taurus, Leo, Scorpio, Aquarius
   *
   * Start from 9th sign.
   */
  else if (
    [1, 4, 7, 10]
      .includes(rashiIndex)
  ) {

    startingSign =
      (rashiIndex + 8) % 12;

  }

  /*
   * Dual signs:
   * Gemini, Virgo,
   * Sagittarius, Pisces
   *
   * Start from 5th sign.
   */
  else {

    startingSign =
      (rashiIndex + 4) % 12;

  }

  const navamsaSignIndex =
    (
      startingSign +
      navamsaPart
    ) % 12;

  return {

    sign:
      SIGNS[
        navamsaSignIndex
      ],

    signIndex:
      navamsaSignIndex,

    navamsaPart:
      navamsaPart + 1,

    degree:
      round(
        (
          degreeInSign %
          NAVAMSA_SIZE
        ) * 9
      )
  };
}


export function generateNavamsaChart(
  lagnaLongitude,
  planets
) {

  // -------------------------
  // D9 Lagna
  // -------------------------

  const lagna =
    calculateNavamsa(
      lagnaLongitude
    );

  // -------------------------
  // D9 Planets
  // -------------------------

  const navamsaPlanets =
    planets.map(
      planet => {

        const d9 =
          calculateNavamsa(
            planet.longitude
          );

        return {

          name:
            planet.name,

          sign:
            d9.sign,

          signIndex:
            d9.signIndex,

          degree:
            d9.degree,

          navamsaPart:
            d9.navamsaPart,

          house:
            (
              (
                d9.signIndex -
                lagna.signIndex +
                12
              ) %
              12
            ) + 1
        };
      }
    );

  // -------------------------
  // D9 Houses
  // -------------------------

  const houses =
    Array.from(
      { length: 12 },
      (_, index) => {

        const signIndex =
          (
            lagna.signIndex +
            index
          ) % 12;

        return {

          house:
            index + 1,

          sign:
            SIGNS[
              signIndex
            ],

          signIndex,

          planets:
            navamsaPlanets
              .filter(
                p =>
                  p.house ===
                  index + 1
              )
              .map(
                p => p.name
              )
        };
      }
    );

  return {

    chart:
      'D9',

    name:
      'Navamsa',

    lagna,

    planets:
      navamsaPlanets,

    houses
  };
}


function normalize(value) {

  return (
    (
      Number(value) %
      360
    ) +
    360
  ) % 360;
}


function round(value) {

  return (
    Math.round(
      value * 1000000
    ) /
    1000000
  );
}