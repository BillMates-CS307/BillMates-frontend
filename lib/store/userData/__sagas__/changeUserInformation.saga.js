import {
  put,
  take,
  takeLeading,
  select,
  fork,
  call,
  takeEvery,
} from "@redux-saga/core/effects";
import { userDataAction, selectUserData } from "../userData.slice";
import { popupAction } from "../../popup/popup.slice";
import { formPopupFlowSaga } from "../../popup/__sagas__/formPopup.saga";

function* flowChangeUserInformation() {
  yield put(userDataAction.beginFlowChangeUserInformation());
  const {
    email,
    name,
    oldPassword,
    newPassword,
    isWrongOldPassword,
    isWrongNewPassword,
    isWrongNewPasswordConfirm,
  } = yield select(selectUserData);
  // notification to check the passwords
  if (isWrongOldPassword || isWrongNewPassword || isWrongNewPasswordConfirm) {
    // TODO: Notification
    yield fork(
      formPopupFlowSaga,
      popupAction.request({
        mainTexts: "USER INFO ERROR",
        subTexts: "Check your inputs",
      })
    );

    yield take(popupAction.successFlowFormPopup.type);
    yield put(userDataAction.failureFlowChangeUserInformation());
    return;
  }

  // TODO: email from JWT_token
  // TODO: change changeSettings to changeUserInfo api
  const res = yield call(changeSettings, {
    email,
    name,
    oldPassword,
    newPassword,
  });
  console.log("in saga");
  console.log(res);

  if (!res.token_success || !res.change_success) {
    yield fork(
      formPopupFlowSaga,
      popupAction.request({
        mainTexts: "USER INFO ERROR",
        subTexts: "Server issue",
      })
    );

    yield take(popupAction.successFlowFormPopup.type);
    yield put(userDataAction.failureFlowChangeUserInformation());
    return;
  }

  yield fork(
    formPopupFlowSaga,
    popupAction.request({
      mainTexts: "USER INFO",
      subTexts: "SUCCESS",
    })
  );

  yield take(popupAction.successFlowFormPopup.type);
  yield put(userDataAction.successFlowChangeUserInformation());
}

function* watchChangeUserInformation() {
  yield takeLeading(
    userDataAction.requestFlowChangeUserInformation.type,
    flowChangeUserInformation
  );
}

export default [watchChangeUserInformation];
