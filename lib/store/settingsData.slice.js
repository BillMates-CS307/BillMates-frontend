import { createSelector, createSlice } from "@reduxjs/toolkit";
import { NOTIFICATION_PREFERENCE } from "../constants";

const initialState = () => {
  return {
    name: "",
    password: "",
    notiPref: NOTIFICATION_PREFERENCE.BOTH,
  };
};

const settingsDataSlice = createSlice({
  initialState: initialState(),
  name: "settingsData",
  reducers: {
    // setter
    setName: (state, action) => {
      state.name = action.payload.name;
    },
    setPassword: (state, action) => {
      state.password = action.payload.password;
    },
    setNotiPref: (state, action) => {
      state.notiPref = action.payload.notiPref;
    },
  },
});

const settingsData = (state) => state.settingsData;

// action creator
export const settingsDataAction = settingsDataSlice.actions;

// selector
export const selectsettingsData = createSelector(
  settingsData,
  (state) => state
);

// root reducer
export const settingsDataReducer = settingsDataSlice.reducer;
