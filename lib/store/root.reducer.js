import { combineReducers } from "@reduxjs/toolkit";
import { groupDataReducer } from "./groupData.slice";
import { userDataReducer } from "./userData.slice";

const combinedReducer = combineReducers({
  userData: userDataReducer,
  groupData : groupDataReducer,
});

export default combinedReducer;
