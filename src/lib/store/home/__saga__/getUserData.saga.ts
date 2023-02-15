import { put, takeLeading } from 'redux-saga/effects'
import { store } from '@lib/store/store'
import { getUserData } from '@lib/store/api/__slice__/userData.api.slice'
import { homeActions } from '@lib/store/home/__slice__/home.slice'

export function* getUserDataWork() {
  yield put(homeActions.beginGetUserData())

  const subscription = getUserData.initiate({})(store.dispatch, store.getState, null)

  const { isError }: { isError: boolean } = yield subscription

  subscription.unsubscribe()

  if (isError) {
    yield put(homeActions.failureGetUserData())
    return
  }

  yield put(homeActions.successGetUserData())
}

export function* watchGetUserData() {
  yield takeLeading(homeActions.requestGetUserData.type, getUserDataWork)
}
