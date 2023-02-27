import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

export default function NotificationItem({
  isFirst,
  id,
  sender,
  message,
  time,
  isRead,
}) {
  return (
    <NotificationItemWrapper
      isRead={isRead}
      isFirst={isFirst}
      href={`/notifications/:${id}`}
    >
      <ProfileWrapper>
        <Profile />
      </ProfileWrapper>
      <ContentsWrapper>
        <Sender>{sender}</Sender>
        <Message>{message}</Message>
        <Time>{time}</Time>
      </ContentsWrapper>
    </NotificationItemWrapper>
  );
}

const NotificationItemWrapper = styled(Link)`
  ${({ isRead, isFirst }) => css`
    display: flex;
    justify-content: flex-start;
    margin-top: ${isFirst ? 0 : 5}px;
    height: 80px;
    color: ${isRead ? "white" : "black"};
    background-color: ${isRead ? "gray" : "#00c923"};
    border-radius: 10px;

    :hover {
      cursor: pointer;
    }
  `}
`;

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: 100%;
  width: 80px;
  max-width: 80px;
  min-width: 80px;
`;

const Profile = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: red;
`;

const ContentsWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  padding: 10px;
  width: 100%;
`;

const Sender = styled.h3``;

const Message = styled.div``;

const Time = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;
