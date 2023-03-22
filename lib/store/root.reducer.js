import { combineReducers } from "@reduxjs/toolkit";
import { groupDataReducer } from "./groupData.slice";
import deepmerge from "deepmerge";
import { userDataReducer } from "./userData.slice";
import { HYDRATE } from "next-redux-wrapper";

const combinedReducer = combineReducers({
  userData: userDataReducer,
  groupData : groupDataReducer,
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
