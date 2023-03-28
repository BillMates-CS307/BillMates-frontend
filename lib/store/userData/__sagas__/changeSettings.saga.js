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
import { isNil } from "lodash";

function* flowChangeSettings() {
  yield put(userDataAction.beginFlowChangeSettings());
  const {
    email,
    settings: { notification },
  } = yield select(selectUserData);

  const res = yield call(changeSettings, {
    email,
    notification,
  });
  console.log("in saga");
  console.log(res);

  if (!isNil(res.error) || !res.token_success || !res.change_success) {
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
