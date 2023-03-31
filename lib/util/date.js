import { DateTime, Settings } from "luxon";

const TIME_ZONE_INDIANA = "America/Indiana";
// Configure the time zone
Settings.defaultZone = TIME_ZONE_INDIANA;

export const getZonedDate = (date) => DateTime.fromJSDate(date);
