import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = () => {
  return {
    groupId: "",
    name: "",
    members: {},
    expenses: [],
    pending : [],
    balance : 0.00,
    balances : {},
    manager : "",
    maxComment : 0, //changed from 0, set 200 as default
    settings : {}
  };
};

const groupDataSlice = createSlice({
  initialState: initialState(),
  name: "groupData",
  reducers: {
    //setter methods
    setGroupId: (state, action) => {
      state.groupId = action.payload.groupId;
    },
    setGroupData : (state, action) => {
        state.groupId = action.payload.groupId;
        state.name = action.payload.name;
        state.members = action.payload.members;
        state.expenses = action.payload.expenses;
        state.pending = action.payload.pending;
        state.balance = action.payload.balance;
        state.maxComment = action.payload.maxComment;
        state.manager = action.payload.manager;
        state.settings = action.payload.settings;
    },
    clear: (state, action) => {
      state = initialState();
    },
  },
});

const groupData = (state) => state.groupData;
export const selectGroupData = (state) => state.groupData; //for group settings
export const selectGroupId = (state) => state.groupData.groupId;

// action creator
export const groupDataAction = groupDataSlice.actions;

// selector
export const groupUserData = createSelector(groupData, (state) => state);

// root reducer
export const groupDataReducer = groupDataSlice.reducer;
