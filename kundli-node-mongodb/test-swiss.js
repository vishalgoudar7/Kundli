import {
  dateToJulianDay,
  calculatePosition,
  calculateHouses,
  Planet,
  HouseSystem
} from "@swisseph/node";

const birthDate = new Date("1998-06-12T02:40:00Z");

const jd = dateToJulianDay(birthDate);

console.log("Julian Day:", jd);

const sun = calculatePosition(jd, Planet.Sun);
const moon = calculatePosition(jd, Planet.Moon);

console.log("Sun:", sun);
console.log("Moon:", moon);

const houses = calculateHouses(
  jd,
  15.8497,
  74.4977,
  HouseSystem.Placidus
);

console.log("Ascendant:", houses.ascendant);
console.log("Houses:", houses.cusps);