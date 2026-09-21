import { DateTime } from 'luxon';

export function localBirthToUTC(date, time, timezone) {
  const dt = DateTime.fromISO(`${date}T${time}`, { zone: timezone });
  if (!dt.isValid) {
    const err = new Error(`Invalid birth datetime/timezone: ${dt.invalidExplanation || 'unknown error'}`);
    err.status = 400;
    throw err;
  }
  return dt.toUTC().toISO();
}
