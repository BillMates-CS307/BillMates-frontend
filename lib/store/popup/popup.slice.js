import { createSelector, createSlice } from "@reduxjs/toolkit";
import isUndefined from "lodash/isUndefined";
import { getZonedDate } from "@/lib/util/date";

export const initialState = () => {
  return {
    mainTexts: "",
    subTexts: "",
    isEndEvent: false,
    endEventAt: new Date(Date.UTC(2022, 2, 31, 7, 0, 0)).valueOf(), // TODO: timestamp 필요
  };
};

const popupSlice = createSlice({
  initialState: initialState(),
  name: "popup",
  reducers: {
    // formPopup flow
    requestFlowFormPopup: (state, action) => {},
    beginFlowFormPopup: () => {},
    successFlowFormPopup: () => {},
    failureFlowFormPopup: () => {},

    // endPopup flow
    requestFlowEndPopup: (state, action) => {},
    beginFlowEndPopup: () => {},
    successFlowEndPopup: () => {},
    failureFlowEndPopup: () => {},

    request: (state, action) => {},
    setContent: (state, action) => {
      state.mainTexts = action.payload.mainTexts;
      state.subTexts = action.payload.subTexts;
    },
    clearContent: (state) => {
      return initialState();
    },
    show: (state) => {
      state.isVisible = true;
    },
    hide: (state) => {
      state.isVisible = false;
    },
    end: (state) => {
      state.isEndEvent = true;
    },
    onClick: () => {},
    timeout: () => {},
  },
});

const popupState = (state) => state.popup;

// action creator
export const popupAction = popupSlice.actions;

// reducer
export const popupReducer = popupSlice.reducer;

// selector
export const selectPopup = createSelector(popupState, (state) => state);
export const selectPopupIsVisible = createSelector(
  popupState,
  (state) => state.isVisible
);
export const selectPopupIsEndEvent = createSelector(
  popupState,
  (state) => state.isEndEvent
);
export const selectPopupIsEndEventAtLaterThanNow = createSelector(
  popupState,
  (state) =>
    isUndefined(state.endEventAt) ||
    getZonedDate(new Date(state.endEventAt)).diffNow().valueOf() > 0
);
export const selectPopupEndEventAt = createSelector(
  popupState,
  (state) => state.endEventAt
);
export const selectMainTexts = createSelector(
  popupState,
  (state) => state.mainTexts
);
export const selectSubTexts = createSelector(
  popupState,
  (state) => state.subTexts
);
