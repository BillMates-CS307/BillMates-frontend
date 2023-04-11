import { EVENTS_RECURRING_TYPE } from "@/lib/constants";
import { createSelector, createSlice } from "@reduxjs/toolkit";

// TODO: restore the original after connecting API
const initialState = () => {
  return {
    events: [],
  };
};

/*event format
{
  {
    creator: string,
    name: string,
    descripion: string,
    date: ISO date string,
    time: ISO time string,
    frequency: string,
    group_name: string or null (ONLY for user_calendar)
    total: double or null, (ONLY for recurring expense)
    expense: dict or null, (ONLY for recurring expense)
    location: string or null, (ONLY for event)
  }
}*/

const calendarDataSlice = createSlice({
  initialState: initialState(),
  name: "calendarData",
  reducers: {
    // setter
    setCalendarData: (state, action) => {
      state.events = action.payload.events;
    },
  },
});

const calendarData = (state) => state.calendarData;

// action creator
export const calendarDataAction = calendarDataSlice.actions;

// selector
export const selectCalendarData = createSelector(
  calendarData,
  (state) => state
);

export const selectNonrecurringCalendarData = createSelector(
  calendarData,
  (state) =>
    state.events.filter((ev) => ev.frequency === EVENTS_RECURRING_TYPE.NONE)
);

export const selectRecurringCalendarData = createSelector(
  calendarData,
  (state) =>
    state.events.filter((ev) => ev.frequency !== EVENTS_RECURRING_TYPE.NONE)
);

// root reducer
export const calendarDataReducer = calendarDataSlice.reducer;
