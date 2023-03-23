import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty, isUndefined } from "lodash";
import styled from "@emotion/styled";
import Header from '../global_components/header.jsx'
import Footer from '../global_components/footer_no_plus.jsx'
import NotificationItem from "./__components__/NotificationItem";
import NotificationDetail from "./__components__/NotificationDetail.jsx";
import { selectUserData } from "@/lib/store/userData.slice";
import CustomHead from "../global_components/head.jsx";
import { user_methods } from "@/lambda_service/userService.js";
import { useRouter } from "next/router.js";

export default function Notifications() {
  //authenticate user
  const router = useRouter();
  const [isAuthenticated, setAuthentication] = useState(false);
  async function check() {
    let result = await user_methods.validateLoginJWT(router);
    if (result.success) {
      localStorage.setItem("tempId", result.payload.email);
      setAuthentication(true);
    }
  }
  useEffect(()=> {
      if (!isAuthenticated) {
          console.log("authenticating");
          check();
      }
  },[isAuthenticated]);


  const email = (isAuthenticated) ? localStorage.getItem("tempId") : null;
  const [notifications, setNotifications] = useState([]);
  const [isEmptyNotifications, setIsEmptyNotifications] = useState(false);
  const [currentNotificationDetail, setCurrentNotificationDetail] = useState(-1);

  const getAllNotifications = async (email) => {
    console.log("fetching notifications...");
        const endpoint = "/api/get_all_notifications";
  
        // Form the request for sending data to the server.
        const options = {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email : email}),
        };
        const response = await fetch(endpoint, options);
        // console.log(response);
        if (response.status == 400) {
          alert("Failed ");
          return;
        }
  
        const result = await response.json();
        // const result = {
        //   notifications: [
        //     {
        //       _id : "0",
        //       sender : "testing@email.com",
        //       message : "some testing text to see how it all shows up",
        //       time : "11:58pm",
        //       isread : false
        //     },
        //     {
        //       _id : "1",
        //       sender : "testing@email.com",
        //       message : "You have been removed from group 'Testing'",
        //       time : "11:58pm",
        //       isread : false
        //     },
        //     {
        //       _id : "2",
        //       sender : "testing@email.com",
        //       message : "Something else here or just a lot of texeeeetxtxtxt",
        //       time : "11:58pm",
        //       isread : true
        //     },
        //     {
        //       _id : "3",
        //       sender : "testing@email.com",
        //       message : "some testing text to see how it all shows up",
        //       time : "11:58pm",
        //       isread : false
        //     }
        //   ]
        // }
        if (isEmpty(result.notifications)) {
          setIsEmptyNotifications(true);
        }
  
        setNotifications(result.notifications);
  };
  useEffect(() => {
    if (isAuthenticated && email != null) {
        getAllNotifications(email); //make the call
    }
}, [isAuthenticated]);
  const readNotification = (index) => {
    if (!notifications[index].isread) {
      const id = notifications[index]._id;
      const data = JSON.stringify(
        {
          object_id : id
        }
      )
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
        fetch(endpoint, options);
    }

    notifications[index].isread = true;
    setCurrentNotificationDetail(index);
  }
  const deleteNotification = (index) => {
    const data = {
      object_id: notifications[index]._id,
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
    fetch(endpoint, options); //make the call and don't worry about response

    notifications.splice(index, 1);
    setCurrentNotificationDetail(-1);
  }

  if (isEmptyNotifications) {
    return (
      <>
      <CustomHead title={"Notifications"} description={"Shows BillMates notifications"}></CustomHead>
        <Header />
        <NotificationsWrapper>No Notifications</NotificationsWrapper>
        <Footer />
      </>
    );
  }

  return (
    <>
    <CustomHead title={"Notifications"} description={"Shows BillMates notifications"}></CustomHead>
      <Header></Header>
      { (currentNotificationDetail != -1)?
        <NotificationDetail closePanel={setCurrentNotificationDetail}
        deleteNotification={deleteNotification} 
        index = {currentNotificationDetail}
        {...notifications[currentNotificationDetail]}></NotificationDetail>
        :
        <></>
      }
      <NotificationsWrapper>
        <NotificationsList>
          {!isUndefined(notifications) &&
            notifications.map((noti, i) => (
              <NotificationItem key={i} index={i} isfirst={i == 0} showDetail={readNotification} {...noti} />
            ))}
        </NotificationsList>
      </NotificationsWrapper>
      <Footer />
    </>
  );
}

const NotificationsWrapper = styled.div`
  width : 90%;
  max-width : 700px;
  height : fit-content;
  max-height: calc(100% - 20px);
  overflow-y: scroll;
  margin: 10px auto;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: 1px 2px 15px 0 #949494;
  background: var(--main-background);
`;

const NotificationsList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
