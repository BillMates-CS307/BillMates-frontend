import { createSelector } from '@reduxjs/toolkit'
import { createAuthApiSliceReducerPathBy } from '@lib/store/__helper__/createApiSlice'
import { ONE_YEAR_SECONDS } from '@lib/constants'

// TODO: Should move this to redux folder later since it is the result from auth
const userid = ''

export interface IGroup {
  groupRef: string
  totalExpense: number
}

export interface IUserDataResult {
  username: string
  email: string
  name: string
  groups: IGroup[]
}

export interface IUserDataParams {}

export const userDataBaseApiSlice = createAuthApiSliceReducerPathBy('apiUserData')

export const userDataApiSlice = userDataBaseApiSlice.injectEndpoints({
  endpoints: builder => ({
    getUserData: builder.query<IUserDataResult, IUserDataParams>({
      query: body => ({
        body,
        method: 'GET',
        // userid from redux
        url: `/users/${userid}`,
      }),
      keepUnusedDataFor: ONE_YEAR_SECONDS,
    }),
  }),
  overrideExisting: true,
})

export const { getUserData } = userDataApiSlice.endpoints

const getuserDataState = getUserData.select({})

// selector
export const selectUserData = createSelector(getuserDataState, data => data)
