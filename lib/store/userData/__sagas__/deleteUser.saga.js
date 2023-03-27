import {
  put,
  take,
  takeLeading,
  select,
  fork,
  call,
  takeEvery,
} from "@redux-saga/core/effects";
import Router from "next/router";
import { userDataAction, selectUserData } from "../userData.slice";
import { popupAction } from "../../popup/popup.slice";
import { formPopupFlowSaga } from "../../popup/__sagas__/formPopup.saga";
import deleteUser from "@/lib/api/deleteUser";
import { user_methods } from "@/lambda_service/userService";
import { isNil } from "lodash";

function* flowDeleteUserInformation() {
  yield put(userDataAction.beginFlowDeleteUserInformation());
  const { email } = yield select(selectUserData);

  const res = yield call(deleteUser, {
    email,
  });
  console.log("in saga");
  console.log(res);

  if (!isNil(res.error) || !res.token_success || !res.delete_success) {
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
  // TODO: route to home
  yield call(user_methods.signOut);
  yield call([localStorage, localStorage.clear]);
  yield put(userDataAction.clear);
  yield put(userDataAction.successFlowDeleteUserInformation());
  yield call(Router.push, "/");
}

function* watchDeleteUserInformation() {
  yield takeLeading(
    userDataAction.requestFlowDeleteUserInformation.type,
    flowDeleteUserInformation
  );
}

export default [watchDeleteUserInformation];
