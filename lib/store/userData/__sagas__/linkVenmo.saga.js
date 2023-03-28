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
import { setCookie } from "cookies-next";

function* flowLinkVenmo() {
  yield put(userDataAction.beginFlowLinkVenmo());
  const { venmoEmail, venmoPassword } = yield select(selectUserData);
  let venmoAccessToken = null;

  const loginVenmoRes = yield call(
    user_methods.loginVenmoWithCredentials,
    venmoEmail,
    venmoPassword
  );
  console.log("in saga");
  console.log(loginVenmoRes);

  if (loginVenmoRes.error) {
    if (loginVenmoRes.status !== 400 || loginVenmoRes.status !== 401) {
      yield fork(
        formPopupFlowSaga,
        popupAction.request({
          mainTexts: "LOGIN VENMO ERROR",
          subTexts: "Check Inputs",
        })
      );

      yield take(popupAction.successFlowFormPopup.type);
      yield put(userDataAction.failureFlowLinkVenmo());
      return;
    }

    yield fork(
      formPopupFlowSaga,
      popupAction.request({
        mainTexts: "NEED 2 FACTOR AUTH",
        subTexts: "CHECK SMS",
      })
    );
    yield take(popupAction.successFlowFormPopup.type);

    const venmoSMSRes = yield call(
      user_methods.sendVenmoSms,
      loginVenmoRes.OtpSecret,
      loginVenmoRes.error
    );

    if (venmoSMSRes.error) {
      yield fork(
        formPopupFlowSaga,
        popupAction.request({
          mainTexts: "VENMO SMS ERROR",
          subTexts: "Check SMS",
        })
      );

      yield take(popupAction.successFlowFormPopup.type);
      yield put(userDataAction.failureFlowLinkVenmo());
      return;
    } else {
      venmoAccessToken = venmoSMSRes.access_token;
    }
  } else {
    venmoAccessToken = loginVenmoRes.access_token;
  }

  yield fork(
    formPopupFlowSaga,
    popupAction.request({
      mainTexts: "LINK VENMO",
      subTexts: "SUCCESS",
    })
  );

  yield take(popupAction.successFlowFormPopup.type);
  yield call(setCookie, "venmo-access-token", venmoAccessToken);
  yield put(userDataAction.clearVenmoData);
  yield put(userDataAction.successFlowLinkVenmo());
}

function* watchLinkVenmo() {
  yield takeLeading(userDataAction.requestFlowLinkVenmo.type, flowLinkVenmo);
}

export default [watchLinkVenmo];
