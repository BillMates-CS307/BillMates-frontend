import { combineReducers } from "@reduxjs/toolkit";
import { userDataReducer } from "./userData.slice";

const combinedReducer = combineReducers({
  userData: userDataReducer,
});

export default combinedReducer;
