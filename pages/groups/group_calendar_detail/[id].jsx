import React, { useState, useEffect } from "react";
import { useRouter } from "next/router.js";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  selectUserData,
  userDataAction,
} from "@/lib/store/userData/userData.slice";
import { user_methods } from "@/lambda_service/userService";
import Header from "@/pages/global_components/groups_header";
import Footer from "@/pages/global_components/footer";
import CustomHead from "@/pages/global_components/head";
import { CommonPopup } from "@/lib/ui/CommonPopup";
import { selectGroupData } from "@/lib/store/groupData.slice";
import CalendarContents from "../_components_/CalendarContents";
import { selectCalendarData } from "@/lib/store/calendarData/calendarData.slice";
import CalendarDetailItem from "../_components_/CalendarDetailItem";

export default function GroupCalendarDetail() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isAuthenticated, setAuthentication] = useState(false);
  const groupData = useSelector(selectGroupData);
  const eventsSortedByTime = useSelector(selectCalendarData)
    .events.filter(
      (ev) =>
        moment(ev.date).format("YYYY-MM-DD") ===
        moment(router.query.date).format("YYYY-MM-DD")
    )
    .sort(({ time: a }, { time: b }) => (a > b ? 1 : a < b ? -1 : 0));
  const userId = isAuthenticated ? localStorage.getItem("tempId") : null;

  console.log("calendar detail");
  console.log(eventsSortedByTime);
  async function check() {
    let result = await user_methods.validateLoginJWT(router);
    if (result.success) {
      localStorage.setItem("tempId", result.payload.email);
      setAuthentication(true);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("authenticating");
      check();
    }
  }, [isAuthenticated]);

  function holdGroupID() {
    if (userId == groupData.manager) {
      router.push("/groupsettings/" + groupData.groupId);
    } else {
      router.push("/groupsettings_members/" + groupData.groupId);
    }
  }

  return (
    <>
      <CustomHead
        title={"Group Calendar Detail"}
        description={"A BillMates group calendar detail"}
      />
      <CommonPopup />
      <Header groupId={holdGroupID} />
      <CalendarWrapper>
        {eventsSortedByTime.map((ev, i) => (
          <CalendarDetailItem key={i} {...ev} />
        ))}
        <Space />
      </CalendarWrapper>
      <Footer />
    </>
  );
}

const CalendarWrapper = styled.div`
  max-width: 700px;
  width: 90%;
  margin: 0 auto;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: 1px 2px 15px 0 #949494;
  color: var(--main-background-font-color);
  background: var(--main-background);
`;

const CalendarTitleWrapper = styled.div`
  padding: 10px;
  width: 100%;
  background: var(--green-background);
  color: var(--main-background-font-color);
`;

const CalendarTitle = styled.h3``;

const Space = styled.div`
  width: 100%;
  height: 50px;
`;
