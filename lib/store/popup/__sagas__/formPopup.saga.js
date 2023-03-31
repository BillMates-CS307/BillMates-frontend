import { put, take, takeLeading } from "@redux-saga/core/effects";
import { popupAction } from "../popup.slice";

export function* formPopupFlowSaga(action) {
  yield put(popupAction.beginFlowFormPopup());
  yield put(popupAction.setContent(action.payload));
  yield put(popupAction.show());
  yield take([popupAction.onClick.type, popupAction.timeout.type]);
  yield put(popupAction.hide());
  yield put(popupAction.clearContent());
  yield put(popupAction.successFlowFormPopup());
}

export function* watchFormPopupSaga() {
  yield takeLeading(popupAction.requestFlowFormPopup.type, formPopupFlowSaga);
}

export default [watchFormPopupSaga];
