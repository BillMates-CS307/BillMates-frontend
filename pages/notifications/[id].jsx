import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import Header from "../Globals/Header";
import Footer from "../Globals/Footer";

const NotificationDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  // TODO: notification data fetch based on id

  return (
    <>
      <Header />
      <NotificationDetailWrapper>
        <NotificationDetailContentsWrapper>
          <NotificationDetailTitle>Title</NotificationDetailTitle>
          <NotificationDetailSender>Sender</NotificationDetailSender>
          <NotificationDetailMessage>
            MessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessage
            MessageMessageMessageMessageMessageMessage
          </NotificationDetailMessage>
          <NotificationDetailTime>Time</NotificationDetailTime>
        </NotificationDetailContentsWrapper>
      </NotificationDetailWrapper>
      <Footer />
    </>
  );
};

export default NotificationDetail;

const NotificationDetailWrapper = styled.div`
  max-width: 440px;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 1px 2px 15px 0 #949494;
  background: #fff;
  color: black;
`;

const NotificationDetailContentsWrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  max-height: 600px;
  border: 1px solid #949494;
  border-radius: 10px;
  overflow: hidden;
`;

const NotificationDetailTitle = styled.div`
  padding: 10px;
  background-color: #00c923;
  font-size: 16px;
  font-weight: bold;
`;

const NotificationDetailSender = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 5px 10px;
`;

const NotificationDetailMessage = styled.div`
  margin: 0 10px;
  padding: 10px 5px;
  max-width: 100%;
  border-top: 1px solid #949494;
  word-break: break-word;
`;

const NotificationDetailTime = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 5px 10px;
  color: #949494;
`;
