import { userDataBaseApiSlice } from '@lib/store/api/__slice__/userData.api.slice'

export const apiCombineReducer = () => ({
  [userDataBaseApiSlice.reducerPath]: userDataBaseApiSlice.reducer,
})

export const getApiMiddleware = () => [userDataBaseApiSlice.middleware]
