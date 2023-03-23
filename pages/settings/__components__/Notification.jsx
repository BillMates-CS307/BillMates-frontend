import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useTheme } from "next-themes";
import { THEME, NOTIFICATION_PREFERENCE } from "@/lib/constants";
import { useSelector, useDispatch } from "react-redux";
import { selectUserData, userDataAction } from "@/lib/store/userData.slice";

export default function Notification() {
  const { theme } = useTheme();
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
    <NotificationWrapper theme={theme}>
      <NotificationTitleWrapper theme={theme}>
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
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding-bottom: 10px;
    border-radius: var(--border-radius);
    box-shadow: 1px 2px 3px 0 #949494;
    color: var(--main-background-font-color);
    overflow: hidden;
  `}
`;

const NotificationTitleWrapper = styled.div`
  ${({ theme }) => css`
    padding: 10px;
    width: 100%;
    background: var(--green-background);
    color: var(--main-background-font-color);
  `}
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
