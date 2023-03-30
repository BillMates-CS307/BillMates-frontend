import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

export default function NotificationItem({
  index,
  sender,
  message,
  time,
  isread,
  isfirst,
  showDetail
}) {
  const date = new Date(time);
  return (
    <NotificationItemWrapper
      isread={isread}
      isfirst={isfirst}
      onClick={() => { showDetail(index, index) }}
    >
      <ProfileWrapper>
        <Profile />
      </ProfileWrapper>
      <ContentsWrapper>
        <Sender>{sender}</Sender>
        <Message>{message}</Message>
        <Time>{date.toLocaleDateString()}</Time>
      </ContentsWrapper>
    </NotificationItemWrapper>
  );
}

const NotificationItemWrapper = styled.div`
  ${({ isread, isfirst }) => css`
    margin-top: ${isfirst ? 0 : 5}px;
    color: ${isread ? "white" : "black"};
    background-color: ${isread ? "var(--neutral-background)" : "var(--green-background)"};
    border-radius: var(--border-radius);
    display: grid;
    grid-template-columns : 80px 1fr;

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
  width: 80px;
`;

const Profile = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: var(--red-background);
`;

const ContentsWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  padding: 10px;
  width: 100%;
  overflow : hidden;
`;

const Sender = styled.h3``;

const Message = styled.div`
  padding-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
`;

const Time = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 5px;
  width: 100%;
`;
