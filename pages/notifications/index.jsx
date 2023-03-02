import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Header from "../Globals/Header";
import Footer from "../Globals/Footer";
import NotificationItem from "./__components__/NotificationItem";
import { isUndefined } from "lodash";

export default function Notifications() {
  // TODO: server connection needed
  const [notifications, setNotifications] = useState([]);
  // const notifications = [
  //   {
  //     id: "objectId1",
  //     sender: "sender1",
  //     message:
  //       "some message1some message1some message1some message1some message1",
  //     time: "Some Time?",
  //     isread: false,
  //   },
  //   {
  //     id: "objectId2",
  //     sender: "sender2",
  //     message: "some message2",
  //     time: "Some Time?",
  //     isread: true,
  //   },
  // ];

  useEffect(() => {
    // TODO: should fix it later to bring email from redux
    const data = {
      email: "benlilleydev@gmail.com",
    };
    const JSONdata = JSON.stringify(data);
    console.log(JSONdata);
    const getAllNotifications = async (data) => {
      const endpoint = "/api/get_all_notifications";

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
      // console.log(response);
      if (response.status == 400) {
        alert("Failed ");
        return;
      }

      const result = await response.json();
      console.log(result);
      setNotifications(result.notifications);
    };

    getAllNotifications(JSONdata); // run it, run it
  }, []);

  return (
    <>
      <Header />
      <NotificationsWrapper>
        <NotificationsList>
          {!isUndefined(notifications) &&
            notifications.map((noti, i) => (
              <NotificationItem key={noti._id} isfirst={i == 0} {...noti} />
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
