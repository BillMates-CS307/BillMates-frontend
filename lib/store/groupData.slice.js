import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = () => {
  return {
    groupId : "",
    name : "",
    members : {},
    expenses: [],
    pending : [],
    balance : 0.00,
    manager : "",
    maxComment : 0
  };
};

const groupDataSlice = createSlice({
  initialState: initialState(),
  name: "groupData",
  reducers: {
    //setter methods
    setGroupId : (state, action) => {
      state.groupId = action.payload.groupId;
    },
    setGroupData : (state, action) => {
        state.groupId = action.payload.groupId;
        state.name = action.payload.name;
        state.members = action.payload.members;
        state.expenseHistory = action.payload.expenseHistory;
        state.pendingApproval = action.payload.pendingApproval;
        state.relative = action.payload.relative;
        state.maxComment = action.payload.maxComment;
    },
    clear: (state, action) => {
      state = initialState();
    },
  },
});

const groupData = (state) => state.groupData;

// action creator
export const groupDataAction = groupDataSlice.actions;

// selector
export const groupUserData = createSelector(groupData, (state) => state);

// root reducer
export const groupDataReducer = groupDataSlice.reducer;
