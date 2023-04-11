import { EVENTS_RECURRING_TYPE } from "@/lib/constants";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { isEmpty, isNil } from "lodash";

// TODO: restore the original after connecting API
const initialState = () => {
  return {
    name: null,
    description: null,
    location: null,
    date: null,
    time: null,
  };
};

const eventDataSlice = createSlice({
  initialState: initialState(),
  name: "eventData",
  reducers: {
    // addEvent flow
    requestFlowAddEvent: () => {},
    beginFlowAddEvent: () => {},
    successFlowAddEvent: () => {},
    failureFlowAddEvent: () => {},

    // setter
    setName: (state, action) => {
      state.name = action.payload.name;
    },
    setDescription: (state, action) => {
      state.description = action.payload.description;
    },
    setLocation: (state, action) => {
      state.location = action.payload.location;
    },
    setDate: (state, action) => {
      state.date = action.payload.date;
    },
    setTime: (state, action) => {
      state.time = action.payload.time;
    },
  },
});

const eventData = (state) => state.eventData;

// action creator
export const eventDataAction = eventDataSlice.actions;

// selector
export const selectEventData = createSelector(eventData, (state) => state);

// root reducer
export const eventDataReducer = eventDataSlice.reducer;
