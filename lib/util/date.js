import { DateTime, Settings } from "luxon";
import moment from "moment";
import { isNil } from "lodash";
import { EVENTS_RECURRING_TYPE } from "@/lib/constants";

const TIME_ZONE_INDIANA = "America/Indiana";
// Configure the time zone
Settings.defaultZone = TIME_ZONE_INDIANA;

export const getZonedDate = (date) => DateTime.fromJSDate(date);

export const checkEventDayBy = (date) => (ev) => {
  // normal event
  // console.log(`checkEventDayBy ${date}`);
  // console.log(ev.date);
  // console.log(ev.frequency);
  // if (typeof date !== "string") {
  //   return false;
  // }

  if (
    moment(ev.date).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")
  ) {
    return true;
  }

  if (!isNil(ev.frequency) && ev.frequency != EVENTS_RECURRING_TYPE.NONE) {
    switch (ev.frequency) {
      case EVENTS_RECURRING_TYPE.DAILY:
        // console.log("dailyyyy");
        // console.log(moment(date).format("YYYY-MM-DD"));
        // console.log(ev.date);
        // console.log(moment(date).format("YYYY-MM-DD").localeCompare(ev.date));
        if (moment(date).format("YYYY-MM-DD").localeCompare(ev.date) >= 0) {
          return true;
        }

        return false;
      case EVENTS_RECURRING_TYPE.WEEKLY:
        if (
          moment(date).format("YYYY-MM-DD").localeCompare(ev.date) >= 0 &&
          moment(ev.date).weekday() === moment(date).weekday()
        ) {
          return true;
        }

        return false;
      case EVENTS_RECURRING_TYPE.MONTHLY:
        if (
          moment(date).format("YYYY-MM-DD").localeCompare(ev.date) >= 0 &&
          moment(ev.date).date() === moment(date).date()
        ) {
          return true;
        }

        return false;
      default:
        return false;
    }
  }

  return false;
};
