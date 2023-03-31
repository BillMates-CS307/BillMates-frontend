import { all, call } from "@redux-saga/core/effects";
import userDataSaga from "./userData/userData.saga";

const allSagas = [...userDataSaga];

export default function* rootSaga() {
  yield all(allSagas.map(call));
}
