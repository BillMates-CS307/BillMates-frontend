import { EVENTS_RECURRING_TYPE } from "@/lib/constants";
import { createSelector, createSlice } from "@reduxjs/toolkit";

// TODO: restore the original after connecting API
const initialState = () => {
  return {
    events: [
      {
        title: "mock1",
        comment: "mock comment blabla 1",
        owner: "abcd@mock.mock",
        users: null,
        amount: null,
        recurring: EVENTS_RECURRING_TYPE.NONE,
        date: "2023-04-10",
        time: "11:14",
        location: "mock location for event",
      },
      {
        title: "mock2",
        comment: "mock comment blabla 2",
        owner: "abcd@mock.mock",
        users: ["zzz@mock.mock", "ppp@mock.mock"],
        amount: 17.1,
        recurring: EVENTS_RECURRING_TYPE.WEEKLY,
        date: "2023-04-10",
        time: "10:12",
        location: null,
      },
    ],
  };
};

// event format
// {
//   title: null,
//   comment: null,
//   owner: null,
//   users: null, // event: null, expense: []
//   amount: null, // event: null, expense: int
//   recurring: EVENTS_RECURRING_TYPE.NONE,
//   date: null, // YYYY-MM-DD
//   time: null, // HH-mm
//   location: null, // event: string, expense: null
// }

const calendarDataSlice = createSlice({
  initialState: initialState(),
  name: "calendarData",
  reducers: {
    // setter
    setCalendarData: (state, action) => {
      // state.title = action.payload.title;
      // state.comment = action.payload.comment;
      // state.owner = action.payload.owner;
      // state.users = action.payload.users;
      // state.amount = action.payload.amount;
      // state.recurring = action.payload.recurring;
      // state.time = action.payload.time;
      // state.location = action.payload.location;
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
    state.events.filter((ev) => ev.recurring === EVENTS_RECURRING_TYPE.NONE)
);

export const selectRecurringCalendarData = createSelector(
  calendarData,
  (state) =>
    state.events.filter((ev) => ev.recurring !== EVENTS_RECURRING_TYPE.NONE)
);

// root reducer
export const calendarDataReducer = calendarDataSlice.reducer;
