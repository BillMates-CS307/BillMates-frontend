import { combineReducers } from 'redux'
import { homeReducer } from '@lib/store/home/__slice__/home.slice'

export const homeCombineReducer = combineReducers({
  home: homeReducer,
})
