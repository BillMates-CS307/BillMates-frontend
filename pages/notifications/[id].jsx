import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import Header from "../global_components/header";
import Footer from "../global_components/footer";
import CustomHead from '../global_components/head.jsx'

const NotificationDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [notification, setNotification] = useState({});

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (id == undefined) {
      return;
    }
    const data = {
      object_id: id,
    };
    
    const JSONdata = JSON.stringify(data);

    const getNotification = async (data) => {
      const endpoint = "/api/get_notification";
      // Form the request for sending data to the server.
      const options = {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      };
      const response = await fetch(endpoint, options);

      if (response.status == 400) {
        alert("Failed ");
        return;
      }

      const result = await response.json();
      console.log(result);
      setNotification(result.notification);
    };

    getNotification(JSONdata); // run it, run it
  }, [id]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const data = {
      object_id: notification.id,
    };
    const JSONdata = JSON.stringify(data);

    const readNotification = async (data) => {
      if(data.object_id == undefined) {
        return;
      }
      const endpoint = "/api/read_notification";
      // Form the request for sending data to the server.
      const options = {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      };
      const response = await fetch(endpoint, options);

      if (response.status == 400) {
        alert("Failed ");
        return;
      }

      const result = await response.json();
    };

    readNotification(JSONdata); // run it, run it
  }, [notification]);

  const onClickDeleteHandler = async (e) => {
    e.preventDefault();
    const data = {
      object_id: id,
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/delete_notification";

    // Form the request for sending data to the server.
    const options = {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };
    const response = await fetch(endpoint, options);

    if (response.status == 400) {
      alert("Failed ");
      return;
    }

    const result = await response.json();
    console.log(result);

    router.back();
  };

  return (
    <>
      <CustomHead title={"Notifications"} description={"Shows BillMates"}></CustomHead>
      <Header />
      <NotificationDetailWrapper>
        <NotificationDetailContentsWrapper>
          <NotificationDetailTitle />
          <NotificationDetailSender>
            {notification.sender}
          </NotificationDetailSender>
          <NotificationDetailMessage>
            {notification.message}
          </NotificationDetailMessage>
          <NotificationDetailTime>{notification.time}</NotificationDetailTime>
        </NotificationDetailContentsWrapper>
        <DeleteButtonWrapper onClick={onClickDeleteHandler}>
          Delete
        </DeleteButtonWrapper>
        <Space />
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
  border-radius: var(--border-radius);
  box-shadow: 1px 2px 15px 0 #949494;
  background: var(--main-background);
  color: var(--main-background-font-colors);
`;

const NotificationDetailContentsWrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  max-height: 600px;
  border: 1px solid var(--neutral-background);
  border-radius: var(--border-radius);
  overflow: hidden;
`;

const NotificationDetailTitle = styled.div`
  padding: 10px;
  background-color: var(--green-background);
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
  border-top: 1px solid var(--neutral-background);
  word-break: break-word;
`;

const NotificationDetailTime = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 5px 10px;
  color: var(--dark-neutral-background);
`;

const DeleteButtonWrapper = styled.div`
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  border-radius: var(--border-radius);
  box-shadow: 1px 2px 3px 0 #949494;
  background: var(--green-background);
  color: white;
  font-weight: bold;
`;

const Space = styled.div`
  width: 100%;
  height: 40px;
`;
