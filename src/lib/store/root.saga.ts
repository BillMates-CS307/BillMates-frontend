import { all, call } from '@redux-saga/core/effects'

const allSagas = []

export default function* root() {
  yield all(allSagas.map(call))
}
