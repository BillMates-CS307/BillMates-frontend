import { combineReducers } from "@reduxjs/toolkit";
import deepmerge from "deepmerge";
import { HYDRATE } from "next-redux-wrapper";
import { userDataReducer } from "./userData/userData.slice";
import { groupDataReducer } from "./groupData.slice";
import { popupReducer } from "./popup/popup.slice";
import { calendarDataReducer } from "./calendarData/calendarData.slice";
import { eventDataReducer } from "./eventData/eventData.slice";

const combinedReducer = combineReducers({
  userData: userDataReducer,
  groupData: groupDataReducer,
  calendarData: calendarDataReducer,
  eventData: eventDataReducer,
  popup: popupReducer,
});

const rootReducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = deepmerge(state, action.payload, {
      arrayMerge: (destinationArray, sourceArray, options) => sourceArray,
    });
    return nextState;
  }

  return combinedReducer(state, action);
};

export default rootReducer;
