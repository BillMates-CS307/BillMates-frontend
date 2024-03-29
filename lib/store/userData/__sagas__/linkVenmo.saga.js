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
import { isNil } from "lodash";
import { setCookie } from "cookies-next";
import { userDataAction, selectUserData } from "../userData.slice";
import { popupAction } from "../../popup/popup.slice";
import { formPopupFlowSaga } from "../../popup/__sagas__/formPopup.saga";
import { user_methods } from "@/lambda_service/userService";
import storeVenmoToken from "@/lib/api/storeVenmoToken";

function* flowLinkVenmo() {
  yield put(userDataAction.beginFlowLinkVenmo());
  const { email, venmoEmail, venmoPassword } = yield select(selectUserData);
  let venmoAccessToken = null;

  const loginVenmoRes = yield call(
    user_methods.loginVenmoWithCredentials,
    venmoEmail,
    venmoPassword
  );
  // console.log("in saga");
  // console.log(loginVenmoRes);

  if (loginVenmoRes.error) {
    if (loginVenmoRes.status !== 400 && loginVenmoRes.status !== 401) {
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
      loginVenmoRes["venmo-otp-secret"],
      loginVenmoRes.deviceId
    );

    console.log("in saga");
    console.log(venmoSMSRes);

    if (venmoSMSRes.error) {
      yield fork(
        formPopupFlowSaga,
        popupAction.request({
          mainTexts: "CODE EXPIRED",
          subTexts: "Sign in again then send new code",
        })
      );

      yield take(popupAction.successFlowFormPopup.type);
      yield put(userDataAction.failureFlowLinkVenmo());
      return;
    }

    yield put(
      userDataAction.setIsVenmoSMSCodeSent({ isVenmoSMSCodeSent: true })
    );

    yield take(userDataAction.sendVenmoSMSCode.type);

    const { venmoSMSCode } = yield select(selectUserData);
    const venmoLastAuthRes = yield call(
      user_methods.loginVenmoWithOtp,
      loginVenmoRes.deviceId,
      loginVenmoRes["venmo-otp-secret"],
      venmoSMSCode
    );

    console.log("in saga");
    console.log(venmoLastAuthRes);

    if (venmoLastAuthRes.error) {
      yield fork(
        formPopupFlowSaga,
        popupAction.request({
          mainTexts: "CODE EXPIRED",
          subTexts: "Sign in again then send new code",
        })
      );

      yield take(popupAction.successFlowFormPopup.type);
      yield put(
        userDataAction.setIsVenmoSMSCodeSent({ isVenmoSMSCodeSent: false })
      );
      yield put(userDataAction.failureFlowLinkVenmo());
      return;
    }

    venmoAccessToken = venmoLastAuthRes.access_token;
  } else {
    venmoAccessToken = loginVenmoRes.access_token;
  }

  const res = yield call(storeVenmoToken, {
    email,
    venmo_token: venmoAccessToken,
  });
  console.log("in linkVenmo saga final");
  console.log(res);

  if (!isNil(res.error) || !res.token_success || !res.store_success) {
    yield fork(
      formPopupFlowSaga,
      popupAction.request({
        mainTexts: "API ERROR",
        subTexts: "Fail to store data in db",
      })
    );

    yield take(popupAction.successFlowFormPopup.type);
    yield put(userDataAction.failureFlowChangeSettings());
    return;
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
  yield call(Router.push, "/home");
}

function* watchLinkVenmo() {
  yield takeLeading(userDataAction.requestFlowLinkVenmo.type, flowLinkVenmo);
}

export default [watchLinkVenmo];
