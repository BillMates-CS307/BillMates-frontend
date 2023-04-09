import { EVENTS_RECURRING_TYPE } from "@/lib/constants";
import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = () => {
  return {
    title: null,
    comment: null,
    owner: null,
    users: null, // event: null, expense: []
    amount: null, // event: null, expense: int
    recurring: EVENTS_RECURRING_TYPE.NONE,
    time: null,
    location: null, // event: string, expense: null
  };
};

const calendarDataSlice = createSlice({
  initialState: initialState(),
  name: "calendarData",
  reducers: {
    // setter
    setCalendarData: (state, action) => {
      state.title = action.payload.title;
      state.comment = action.payload.comment;
      state.owner = action.payload.owner;
      state.users = action.payload.users;
      state.amount = action.payload.amount;
      state.recurring = action.payload.recurring;
      state.time = action.payload.time;
      state.location = action.payload.location;
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

// root reducer
export const calendarDataReducer = calendarDataSlice.reducer;
