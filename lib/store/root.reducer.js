import { combineReducers } from "@reduxjs/toolkit";
import { settingsDataReducer } from "./settingsData.slice";

const combinedReducer = combineReducers({
  settingsData: settingsDataReducer,
});

export default combinedReducer;
