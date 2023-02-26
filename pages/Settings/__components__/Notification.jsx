import React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

export default function Notification() {
  const [notification, setNotification] = useState("both");
  return (
    <NotificationWrapper>
      <NotificationTitleWrapper>
        <NotificationTitle>Notification</NotificationTitle>
      </NotificationTitleWrapper>

      <NotificationButtonWrapper>
        <NotificationRadioButton
          type="radio"
          name="noti"
          value="both"
          onChange={(e) => setNotification(e.target.value)}
        />
        <NotificationButtonLabel>Both</NotificationButtonLabel>
      </NotificationButtonWrapper>
      <NotificationButtonWrapper>
        <NotificationRadioButton
          type="radio"
          name="noti"
          value="onlyBillmates"
          onChange={(e) => setNotification(e.target.value)}
        />
        <NotificationButtonLabel>Only Billmates</NotificationButtonLabel>
      </NotificationButtonWrapper>
      <NotificationButtonWrapper>
        <NotificationRadioButton
          type="radio"
          name="noti"
          value="onlyEmail"
          onChange={(e) => setNotification(e.target.value)}
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
