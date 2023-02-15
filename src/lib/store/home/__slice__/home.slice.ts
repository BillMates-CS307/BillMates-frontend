import { RootState } from '@lib/store/store'
import { createSelector, createSlice } from '@reduxjs/toolkit'

interface State {}

const initialState = (): State => ({})

const homeSlice = createSlice({
  initialState: initialState(),
  name: 'home',
  reducers: {
    requestGetUserData: () => {},
    beginGetUserData: () => {},
    successGetUserData: () => {},
    failureGetUserData: () => {},
  },
})

// action creator
export const homeActions = homeSlice.actions

// reducer
export const homeReducer = homeSlice.reducer

// selector

// export const selectMainBottomSheetOpened = createSelector(
//   (state: RootState) => state.main.main,
//   (state: State) => state.isBottomSheetOpened
// )

// export const selectMainSubmitFinished = createSelector(
//   (state: RootState) => state.main.main,
//   (state: State) => state.isSubmitFinished
// )

// export const selectMainIsAlreadySubmitted = createSelector(
//   (state: RootState) => state.driverConsulting.driverConsulting,
//   (state: State) => state.isAlreadySubmitted
// )
