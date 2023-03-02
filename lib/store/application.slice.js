import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = () => {
  return {
    theme: null,
  };
};

const applicationSlice = createSlice({
  initialState: initialState(),
  name: "application",
  reducers: {
    // setter
    setTheme: (state, action) => {
      state.theme = action.payload.theme;
    },
  },
});

const application = (state) => state.application;

// action creator
export const applicationAction = applicationSlice.actions;

// selector
export const selectApplication = createSelector(application, (state) => state);

// root reducer
export const applicationReducer = applicationSlice.reducer;
