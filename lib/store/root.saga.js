import { all, call } from "@redux-saga/core/effects";
import eventDataSaga from "./eventData/eventData.saga";
import userDataSaga from "./userData/userData.saga";

const allSagas = [...userDataSaga, ...eventDataSaga];

export default function* rootSaga() {
  yield all(allSagas.map(call));
}
