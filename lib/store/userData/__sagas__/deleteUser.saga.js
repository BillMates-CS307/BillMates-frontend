import {
  put,
  take,
  takeLeading,
  select,
  fork,
  takeEvery,
} from "@redux-saga/core/effects";
import { userDataAction, selectUserData } from "../userData.slice";
import { popupAction } from "../../popup/popup.slice";
import { formPopupFlowSaga } from "../../popup/__sagas__/formPopup.saga";

function* flowDeleteUserInformation() {
  yield put(userDataAction.beginFlowDeleteUserInformation());
  const { email } = yield select(selectUserData);

  // TODO: email from JWT_token
  // TODO: change changeSettings to deleteUsers api
  const res = yield call(changeSettings, {
    email,
  });
  console.log("in saga");
  console.log(res);

  if (!res.token_success || !res.change_success) {
    yield fork(
      formPopupFlowSaga,
      popupAction.request({
        mainTexts: "DELETE USER INFO ERROR",
        subTexts: "Server issue",
      })
    );

    yield take(popupAction.successFlowFormPopup.type);
    yield put(userDataAction.failureFlowDeleteUserInformation());
    return;
  }

  yield fork(
    formPopupFlowSaga,
    popupAction.request({
      mainTexts: "DELETE USER INFO",
      subTexts: "SUCCESS",
    })
  );

  yield take(popupAction.successFlowFormPopup.type);
  // TODO: clear cookies, clear localstorage
  // TODO: route to home
  yield put(userDataAction.successFlowDeleteUserInformation());
}

function* watchDeleteUserInformation() {
  yield takeLeading(
    userDataAction.requestFlowDeleteUserInformation.type,
    flowDeleteUserInformation
  );
}

export default [watchDeleteUserInformation];
