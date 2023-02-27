import React from "react";
import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import { selectUserData, userDataAction } from "@/lib/store/userData.slice";
import { NOTIFICATION_PREFERENCE } from "@/lib/constants";

export default function Notification() {
  const dispatch = useDispatch();
  const {
    settings: { notification },
  } = useSelector(selectUserData);

  const onNotificationPreferenceChangeHandler = (e) => {
    switch (e.target.value) {
      case NOTIFICATION_PREFERENCE.BOTH:
        dispatch(
          userDataAction.setSettingsNotification({
            settings: { notification: NOTIFICATION_PREFERENCE.BOTH },
          })
        );
        break;
      case NOTIFICATION_PREFERENCE.ONLY_BILLMATES:
        dispatch(
          userDataAction.setSettingsNotification({
            settings: { notification: NOTIFICATION_PREFERENCE.ONLY_BILLMATES },
          })
        );
        break;
      case NOTIFICATION_PREFERENCE.ONLY_EMAIL:
        dispatch(
          userDataAction.setSettingsNotification({
            settings: { notification: NOTIFICATION_PREFERENCE.ONLY_EMAIL },
          })
        );
        break;
    }
  };

  return (
    <NotificationWrapper>
      <NotificationTitleWrapper>
        <NotificationTitle>Notification</NotificationTitle>
      </NotificationTitleWrapper>

      <NotificationButtonWrapper>
        <NotificationRadioButton
          type="radio"
          name="noti"
          value={NOTIFICATION_PREFERENCE.BOTH}
          checked={notification === NOTIFICATION_PREFERENCE.BOTH}
          onChange={onNotificationPreferenceChangeHandler}
        />
        <NotificationButtonLabel>Both</NotificationButtonLabel>
      </NotificationButtonWrapper>
      <NotificationButtonWrapper>
        <NotificationRadioButton
          type="radio"
          name="noti"
          value={NOTIFICATION_PREFERENCE.ONLY_BILLMATES}
          checked={notification === NOTIFICATION_PREFERENCE.ONLY_BILLMATES}
          onChange={onNotificationPreferenceChangeHandler}
        />
        <NotificationButtonLabel>Only Billmates</NotificationButtonLabel>
      </NotificationButtonWrapper>
      <NotificationButtonWrapper>
        <NotificationRadioButton
          type="radio"
          name="noti"
          value={NOTIFICATION_PREFERENCE.ONLY_EMAIL}
          checked={notification === NOTIFICATION_PREFERENCE.ONLY_EMAIL}
          onChange={onNotificationPreferenceChangeHandler}
        />
        <NotificationButtonLabel>Only email</NotificationButtonLabel>
      </NotificationButtonWrapper>
    </NotificationWrapper>
  );
}

const NotificationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-bottom: 10px;
  border-radius: 10px;
  box-shadow: 1px 2px 3px 0 #949494;
  color: black;
  overflow: hidden;
`;

const NotificationTitleWrapper = styled.div`
  padding: 10px;
  width: 100%;
  background: #00c923;
  color: white;
`;

const NotificationTitle = styled.h3``;

const NotificationButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  padding: 0 10px 0 10px;
  width: 100%;
`;

const NotificationButtonLabel = styled.div`
  margin-left: 10px;
`;

const NotificationRadioButton = styled.input`
  font-size: 15px;
  line-height: 26px;
  font-weight: bold;
`;
