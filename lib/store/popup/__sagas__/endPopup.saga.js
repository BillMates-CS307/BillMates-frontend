import { put, select, takeLeading } from "@redux-saga/core/effects";
import {
  popupAction,
  selectPopupIsEndEventAtLaterThanNow,
} from "../popup.slice";

export function* endPopupFlowSaga(action) {
  yield put(popupAction.beginFlowEndPopup());

  const isEndEventAtLaterThanNow = yield select(
    selectPopupIsEndEventAtLaterThanNow
  );

  if (isEndEventAtLaterThanNow) {
    yield put(popupAction.failureFlowEndPopup());
    return;
  }

  yield put(popupAction.end());
  yield put(popupAction.setContent(action.payload));
  yield put(popupAction.show());
  yield put(popupAction.successFlowEndPopup());
}

export function* watchEndPopupSaga() {
  yield takeLeading(popupAction.requestFlowEndPopup.type, endPopupFlowSaga);
}

export default [watchEndPopupSaga];
