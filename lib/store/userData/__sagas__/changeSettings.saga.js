import {
  put,
  take,
  takeLeading,
  select,
  fork,
  takeEvery,
  call,
} from "@redux-saga/core/effects";
import { userDataAction, selectUserData } from "../userData.slice";
import { popupAction } from "../../popup/popup.slice";
import { formPopupFlowSaga } from "../../popup/__sagas__/formPopup.saga";
import changeSettings from "@/lib/api/changeSettings";

function* flowChangeSettings() {
  yield put(userDataAction.beginFlowChangeSettings());
  const {
    email,
    settings: { notification },
  } = yield select(selectUserData);

  // TODO: email from JWT_token
  const res = yield call(changeSettings, {
    email: "lee22058@purdue.edu",
    notification,
  });
  console.log("in saga");
  console.log(res);

  if (!res.token_success || !res.change_success) {
    yield fork(
      formPopupFlowSaga,
      popupAction.request({
        mainTexts: "SETTINGS ERROR",
        subTexts: "SERVER ERR",
      })
    );

    yield take(popupAction.successFlowFormPopup.type);
    yield put(userDataAction.failureFlowChangeSettings());
    return;
  }

  yield fork(
    formPopupFlowSaga,
    popupAction.request({
      mainTexts: "SETTINGS",
      subTexts: "SUCCESS",
    })
  );

  yield take(popupAction.successFlowFormPopup.type);
  yield put(userDataAction.successFlowChangeSettings());
}

function* watchChangeSettings() {
  yield takeLeading(
    userDataAction.requestFlowChangeSettings.type,
    flowChangeSettings
  );
}

export default [watchChangeSettings];
