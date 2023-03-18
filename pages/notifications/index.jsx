import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty, isUndefined } from "lodash";
import styled from "@emotion/styled";
import Header from "../Global_components/header";
import Footer from "../Global_components/footer";
import NotificationItem from "./__components__/NotificationItem";
import { selectUserData } from "@/lib/store/userData.slice";

export default function Notifications() {
  const { email } = useSelector(selectUserData);
  const [notifications, setNotifications] = useState([]);
  const [isEmptyNotifications, setIsEmptyNotifications] = useState(false);

  useEffect(() => {
    const data = {
      email,
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
      if (isEmpty(result.notifications)) {
        setIsEmptyNotifications(true);
      }

      setNotifications(result.notifications);
    };

    getAllNotifications(JSONdata); // run it, run it
  }, []);

  if (isEmptyNotifications) {
    return (
      <>
        <Header />
        <NotificationsWrapper>No Notifications</NotificationsWrapper>
        <Footer />
      </>
    );
  }

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
        <Space />
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

const Space = styled.div`
  width: 100%;
  height: 40px;
`;
