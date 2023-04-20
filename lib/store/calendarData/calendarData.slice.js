import { EVENTS_RECURRING_TYPE } from "@/lib/constants";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { isEmpty, isNil } from "lodash";

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
    total: double or null, (ONLY for recurring expense)
    expense: dict or null, (ONLY for recurring expense)
    location: string or null, (ONLY for event)
    group_name: string or null (ONLY for user_calendar)
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

    popEventFromCalendar: (state, action) => {
      state.events = state.events.filter((ev) => ev.id !== action.payload.id);
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

export const selectIsGroupCalendar = createSelector(
  calendarData,
  (state) =>
    !isEmpty(state.events) && state.events.every((ev) => isNil(ev.group_name))
);

// root reducer
export const calendarDataReducer = calendarDataSlice.reducer;
