# Kundli Node + MongoDB Backend

A clean starter backend for a Vedic Kundli application.

## Stack
- Node.js
- Express
- MongoDB + Mongoose
- Luxon for timezone-safe birth-time conversion
- Modular astrology calculation layer

## Important
This starter implements the deterministic Vedic mapping layer (Rashi, Nakshatra,
Pada, houses from an already-known Ascendant, and chart grouping). The astronomy
provider is intentionally isolated in `src/astrology/ephemeris.js`.

For production, connect that adapter to Swiss Ephemeris or another validated
ephemeris source and verify results against trusted reference charts. Do not use
the demo astronomy fallback as an authoritative birth chart.

## Setup

1. Install Node.js 20+ and MongoDB.
2. Copy `.env.example` to `.env`.
3. Run:

    npm install
    npm run dev

Server: http://localhost:5000

## Health

GET /api/health

## Generate and save Kundli

POST /api/kundli

Example body:

{
  "name": "Demo User",
  "date": "1998-06-12",
  "time": "08:10",
  "place": "Belagavi, Karnataka, India",
  "latitude": 15.8497,
  "longitude": 74.4977,
  "timezone": "Asia/Kolkata",
  "settings": {
    "ayanamsha": "lahiri",
    "nodeType": "mean",
    "houseSystem": "whole-sign",
    "chartStyle": "north-indian"
  }
}

## Other endpoints

GET /api/kundli
GET /api/kundli/:id
DELETE /api/kundli/:id

## Flow

DOB + local time + place
-> latitude/longitude/timezone
-> UTC
-> ephemeris adapter
-> sidereal longitudes
-> Lagna/Rashi/Nakshatra/Pada/Houses
-> MongoDB
-> JSON
-> Next.js SVG chart

## Next production step

Replace `calculateAstronomy()` in `src/astrology/ephemeris.js` with a validated
Swiss Ephemeris Node binding/service. Keep the returned interface unchanged.
