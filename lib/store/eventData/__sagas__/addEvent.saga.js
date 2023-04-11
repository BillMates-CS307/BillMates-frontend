import {
  put,
  take,
  takeLeading,
  select,
  fork,
  call,
  takeEvery,
} from "@redux-saga/core/effects";
import { isNil } from "lodash";
import { popupAction } from "../../popup/popup.slice";
import { formPopupFlowSaga } from "../../popup/__sagas__/formPopup.saga";
import { eventDataAction, selectEventData } from "../eventData.slice";
import addEvent from "@/lib/api/addEvent";
import { selectUserData } from "../../userData/userData.slice";
import { selectGroupData } from "../../groupData.slice";

function* flowAddEvent() {
  yield put(eventDataAction.beginFlowAddEvent());
  const { email } = yield select(selectUserData);
  const { groupId } = yield select(selectGroupData);
  const { name, description, location, date, time } = yield select(
    selectEventData
  );
  // notification to check the passwords
  console.log(email);
  console.log(groupId);
  console.log(name);
  console.log(description);
  console.log(location);
  console.log(date);
  console.log(time);
  if (
    isNil(email) ||
    isNil(groupId) ||
    isNil(name) ||
    isNil(description) ||
    isNil(location) ||
    isNil(date) ||
    isNil(time)
  ) {
    yield fork(
      formPopupFlowSaga,
      popupAction.request({
        mainTexts: "ADD EVENT ERROR",
        subTexts: "Check your inputs",
      })
    );

    yield take(popupAction.successFlowFormPopup.type);
    yield put(eventDataAction.failureFlowAddEvent());
    return;
  }

  const res = yield call(addEvent, {
    email,
    group_id: groupId,
    name,
    description,
    location,
    date,
    time,
  });
  console.log("in saga");
  console.log(res);
  console.log(res.error);
  console.log(!(isNil(res.error) && res.token_success && res.add_success));
  if (!(isNil(res.error) && res.token_success && res.add_success)) {
    yield fork(
      formPopupFlowSaga,
      popupAction.request({
        mainTexts: "ADD EVENT ERROR",
        subTexts: "Server issue",
      })
    );

    yield take(popupAction.successFlowFormPopup.type);
    yield put(eventDataAction.failureFlowAddEvent());
    return;
  }

  yield fork(
    formPopupFlowSaga,
    popupAction.request({
      mainTexts: "ADD EVENT",
      subTexts: "SUCCESS",
    })
  );

  yield take(popupAction.successFlowFormPopup.type);
  yield put(eventDataAction.successFlowAddEvent());
}

function* watchAddEvent() {
  yield takeLeading(eventDataAction.requestFlowAddEvent.type, flowAddEvent);
}

export default [watchAddEvent];
