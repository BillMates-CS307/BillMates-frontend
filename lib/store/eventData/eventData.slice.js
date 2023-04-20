import { EVENTS_RECURRING_TYPE } from "@/lib/constants";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { isEmpty, isNil } from "lodash";

const initialState = () => {
  return {
    removeId: null,
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
    successFlowRemoveEvent: () => {},
    failureFlowRemoveEvent: () => {},

    // removeEvent flow
    requestFlowRemoveEvent: () => {},
    beginFlowRemoveEvent: () => {},
    successFlowRemoveEvent: () => {},
    failureFlowRemoveEvent: () => {},

    // setter
    setRemoveId: (state, action) => {
      state.removeId = action.payload.removeId;
    },
    setEvent: (state, action) => {
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.location = action.payload.location;
      state.date = action.payload.date;
      state.time = action.payload.time;
    },
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
    clear: (state, action) => {
      state.name = null;
      state.description = null;
      state.location = null;
      state.date = null;
      state.time = null;
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
