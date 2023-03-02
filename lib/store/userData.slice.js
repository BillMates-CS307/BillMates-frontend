import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = () => {
  return {
    email: null,
    name: null,
    oldPassword: null, // for settings, NOT for regular user data
    newPassword: null,
    groups: [],
    settings: {
      notification: null,
    },
    notifications: [],
  };
};

const userDataSlice = createSlice({
  initialState: initialState(),
  name: "userData",
  reducers: {
    // setter
    setEmail: (state, action) => {
      state.email = action.payload.email;
    },
    setName: (state, action) => {
      state.name = action.payload.name;
    },
    setOldPassword: (state, action) => {
      state.oldPassword = action.payload.oldPassword;
    },
    setNewPassword: (state, action) => {
      state.newPassword = action.payload.newPassword;
    },
    setGroups: (state, action) => {
      state.groups.push(...action.payload.groups);
    },
    setSettingsNotification: (state, action) => {
      state.settings.notification = action.payload.settings.notification;
    },
    addGroup: (state, action) => {
      state.groups.push(action.payload.group);
    },
    deleteGroup: (state, action) => {
      // It would be easy if we conver Groups to object
      const i = state.groups.findIndex(
        (group) => group.id === action.payload.id
      );
      state.groups = state.groups.splice(i, 1);
    },
    clear: (state, action) => {
      state = initialState();
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
