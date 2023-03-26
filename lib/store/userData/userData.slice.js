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
    isWrongOldPassword: false,
    isWrongNewPassword: false,
    isWrongNewPasswordConfirm: false,
  };
};

const userDataSlice = createSlice({
  initialState: initialState(),
  name: "userData",
  reducers: {
    // changeUserInformation flow
    requestFlowChangeUserInformation: () => {},
    beginFlowChangeUserInformation: () => {},
    successFlowChangeUserInformation: () => {},
    failureFlowChangeUserInformation: () => {},

    // deleteUserInformation flow
    requestFlowDeleteUserInformation: () => {},
    beginFlowDeleteUserInformation: () => {},
    successFlowDeleteUserInformation: () => {},
    failureFlowDeleteUserInformation: () => {},

    // changeSettings flow
    requestFlowChangeSettings: () => {},
    beginFlowChangeSettings: () => {},
    successFlowChangeSettings: () => {},
    failureFlowChangeSettings: () => {},

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
    setIsWrongOldPassword: (state, action) => {
      state.isWrongOldPassword = action.payload.isWrongOldPassword;
    },
    setIsWrongNewPassword: (state, action) => {
      state.isWrongNewPassword = action.payload.isWrongNewPassword;
    },
    setIsWrongNewPasswordConfirm: (state, action) => {
      state.isWrongNewPasswordConfirm =
        action.payload.isWrongNewPasswordConfirm;
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
