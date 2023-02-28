import React from "react";
import styled from "@emotion/styled";
import Header from "../Globals/Header";
import Footer from "../Globals/Footer";
import NotificationItem from "./__components__/NotificationItem";

export default function Notifications() {
  // TODO: server connection needed
  const notifications = [
    {
      id: "objectId1",
      sender: "sender1",
      message:
        "some message1some message1some message1some message1some message1",
      time: "Some Time?",
      isread: false,
    },
    {
      id: "objectId2",
      sender: "sender2",
      message: "some message2",
      time: "Some Time?",
      isread: true,
    },
  ];

  return (
    <>
      <Header />
      <NotificationsWrapper>
        <NotificationsList>
          {notifications.map((noti, i) => (
            <NotificationItem key={noti.id} isfirst={i == 0} {...noti} />
          ))}
        </NotificationsList>
      </NotificationsWrapper>
      <Footer />
    </>
  );
}

const NotificationsWrapper = styled.div`
  max-width: 440px;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 1px 2px 15px 0 #949494;
  background: #fff;
`;

const NotificationsList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
