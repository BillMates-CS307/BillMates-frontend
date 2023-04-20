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
import Router from "next/router";
import { popupAction } from "../../popup/popup.slice";
import { formPopupFlowSaga } from "../../popup/__sagas__/formPopup.saga";
import { eventDataAction, selectEventData } from "../eventData.slice";
import removeEvent from "@/lib/api/removeEvent";
import { selectUserData } from "../../userData/userData.slice";
import { selectGroupData } from "../../groupData.slice";
import {
  calendarDataAction,
  selectCalendarData,
} from "../../calendarData/calendarData.slice";

function* flowRemoveEvent() {
  yield put(eventDataAction.beginFlowRemoveEvent());

  // TODO 어디서 가져올지 정해야됨
  const { removeId } = yield select(selectEventData);
  const { events } = yield select(selectCalendarData);
  const { group_id, id } = events.filter((ev) => ev.id === removeId)[0];
  console.log("in saga before api call");
  console.log(group_id);
  console.log(id);
  const res = yield call(removeEvent, {
    group_id,
    event_id: id,
  });
  console.log("in saga");
  console.log(res);
  console.log(res.error);
  console.log(!(isNil(res.error) && res.token_success && res.remove_success));
  if (!(isNil(res.error) && res.token_success && res.remove_success)) {
    yield fork(
      formPopupFlowSaga,
      popupAction.request({
        mainTexts: "REMOVE EVENT ERROR",
        subTexts: "Server issue",
      })
    );

    yield take(popupAction.successFlowFormPopup.type);
    yield put(eventDataAction.failureFlowRemoveEvent());
    return;
  }

  yield fork(
    formPopupFlowSaga,
    popupAction.request({
      mainTexts: "REMOVE EVENT",
      subTexts: "SUCCESS",
    })
  );

  yield take(popupAction.successFlowFormPopup.type);
  yield put(calendarDataAction.popEventFromCalendar({ id }));
  yield put(eventDataAction.successFlowRemoveEvent());
  // yield call(Router.push, `/groups/group_calendar/${groupId}`);
}

function* watchRemoveEvent() {
  yield takeLeading(
    eventDataAction.requestFlowRemoveEvent.type,
    flowRemoveEvent
  );
}

export default [watchRemoveEvent];
