import { createSelector, createSlice } from "@reduxjs/toolkit";
import { NOTIFICATION_PREFERENCE } from "../constants";

const initialState = () => {
  return {
    name: "",
    changedPassword: "",
    notiPref: NOTIFICATION_PREFERENCE.BOTH,
  };
};

const userDataSlice = createSlice({
  initialState: initialState(),
  name: "userData",
  reducers: {
    // setter
    setName: (state, action) => {
      state.name = action.payload.name;
    },
    setChangedPassword: (state, action) => {
      state.changedPassword = action.payload.changedPassword;
    },
    setNotiPref: (state, action) => {
      state.notiPref = action.payload.notiPref;
    },
  },
});

const userData = (state) => state.userData;

// action creator
export const userDataAction = userDataSlice.actions;

// selector
export const selectUserData = createSelector(userData, (state) => state);

// root reducer
export const userDataReducer = userDataSlice.reducer;
