import {
  combineReducers,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

// TODO: notiPref both, only billmates, only email
const initialState = () => {
  return {
    name: "",
    password: "",
    notifiPref: "",
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
