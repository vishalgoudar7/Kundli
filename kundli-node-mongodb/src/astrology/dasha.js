const DAYS_PER_YEAR = 365.2425;
const NAKSHATRA_SPAN = 360 / 27;
const TOTAL_DASHA_YEARS = 120;

const DASHA_LORDS = [
  { lord: 'Ketu', years: 7 },
  { lord: 'Venus', years: 20 },
  { lord: 'Sun', years: 6 },
  { lord: 'Moon', years: 10 },
  { lord: 'Mars', years: 7 },
  { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter', years: 16 },
  { lord: 'Saturn', years: 19 },
  { lord: 'Mercury', years: 17 }
];

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function addYearsAsDays(date, years) {
  return new Date(
    date.getTime() + years * DAYS_PER_YEAR * MILLISECONDS_PER_DAY
  );
}

function buildAntardashas(mahadashaLordIndex, mahadashaStart, mahadashaYears) {
  const antardashas = [];
  let antardashaStart = new Date(mahadashaStart);

  for (let offset = 0; offset < DASHA_LORDS.length; offset += 1) {
    const antardasha =
      DASHA_LORDS[(mahadashaLordIndex + offset) % DASHA_LORDS.length];
    const antardashaYears =
      (mahadashaYears * antardasha.years) / TOTAL_DASHA_YEARS;
    const antardashaEnd = addYearsAsDays(antardashaStart, antardashaYears);

    antardashas.push({
      lord: antardasha.lord,
      years: antardashaYears,
      start: antardashaStart.toISOString(),
      end: antardashaEnd.toISOString()
    });

    antardashaStart = antardashaEnd;
  }

  return antardashas;
}

export function calculateVimshottariDasha(moonLongitude, birthDate) {
  const longitude = ((Number(moonLongitude) % 360) + 360) % 360;
  const birth = birthDate instanceof Date ? new Date(birthDate) : new Date(birthDate);

  if (!Number.isFinite(Number(moonLongitude))) {
    throw new Error('Invalid Moon longitude for Vimshottari Dasha calculation');
  }

  if (Number.isNaN(birth.getTime())) {
    throw new Error('Invalid birth date for Vimshottari Dasha calculation');
  }

  const nakshatraIndex = Math.floor(longitude / NAKSHATRA_SPAN);
  const mahadashaLordIndex = nakshatraIndex % DASHA_LORDS.length;
  const birthMahadasha = DASHA_LORDS[mahadashaLordIndex];
  const positionInNakshatra = longitude - nakshatraIndex * NAKSHATRA_SPAN;
  const elapsedFraction = positionInNakshatra / NAKSHATRA_SPAN;
  const elapsedYearsAtBirth = birthMahadasha.years * elapsedFraction;
  const remainingYearsAtBirth = birthMahadasha.years - elapsedYearsAtBirth;

  // Reconstruct the full first Mahadasha so its Antardashas have their real
  // boundaries, including those which occurred before the birth time.
  let mahadashaStart = addYearsAsDays(birth, -elapsedYearsAtBirth);
  const mahadashas = [];

  for (let offset = 0; offset < DASHA_LORDS.length; offset += 1) {
    const lordIndex = (mahadashaLordIndex + offset) % DASHA_LORDS.length;
    const mahadasha = DASHA_LORDS[lordIndex];
    const mahadashaEnd = addYearsAsDays(mahadashaStart, mahadasha.years);

    mahadashas.push({
      lord: mahadasha.lord,
      years: mahadasha.years,
      start: mahadashaStart.toISOString(),
      end: mahadashaEnd.toISOString(),
      antardashas: buildAntardashas(
        lordIndex,
        mahadashaStart,
        mahadasha.years
      )
    });

    mahadashaStart = mahadashaEnd;
  }

  const antardashaAtBirth = mahadashas[0].antardashas.find(
    (period) => birth >= new Date(period.start) && birth < new Date(period.end)
  );

  return {
    nakshatraIndex,
    positionInNakshatra,
    birthMahadasha: birthMahadasha.lord,
    elapsedYearsAtBirth,
    remainingYearsAtBirth,
    birthAntardasha: antardashaAtBirth?.lord ?? null,
    mahadashas
  };
}

// ======================================================
// GET DASHA FOR ANY DATE
// ======================================================

export function getCurrentDasha(
  mahadashas,
  targetDate = new Date()
) {
  if (!Array.isArray(mahadashas)) {
    throw new Error('Mahadashas must be an array');
  }

  const date =
    targetDate instanceof Date
      ? targetDate
      : new Date(targetDate);

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      "Invalid target date for current Dasha calculation"
    );
  }

  // ------------------------------------
  // FIND MAHADASHA
  // ------------------------------------

  const mahadasha =
    mahadashas.find((maha) => {
      const start =
        new Date(maha.start);

      const end =
        new Date(maha.end);

      return (
        date >= start &&
        date < end
      );
    });

  if (!mahadasha) {
    return {
      asOf: date.toISOString(),
      mahadasha: null,
      antardasha: null,
      message:
        "No Mahadasha found for this date"
    };
  }

  // ------------------------------------
  // FIND ANTARDASHA
  // ------------------------------------

  const antardasha =
    mahadasha.antardashas?.find(
      (antar) => {
        const start =
          new Date(antar.start);

        const end =
          new Date(antar.end);

        return (
          date >= start &&
          date < end
        );
      }
    );

  // ------------------------------------
  // RETURN
  // ------------------------------------

  return {
    asOf:
      date.toISOString(),

    mahadasha:
      mahadasha.lord,

    antardasha:
      antardasha?.lord || null,

    mahadashaStart:
      mahadasha.start,

    mahadashaEnd:
      mahadasha.end,

    antardashaStart:
      antardasha?.start || null,

    antardashaEnd:
      antardasha?.end || null
  };
}
