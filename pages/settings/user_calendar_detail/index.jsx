import React, { useState, useEffect } from "react";
import { useRouter } from "next/router.js";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { user_methods } from "@/lambda_service/userService";
import Header from "@/pages/global_components/header";
import Footer from "@/pages/global_components/footer";
import CustomHead from "@/pages/global_components/head";
import { CommonPopup } from "@/lib/ui/CommonPopup";
import { selectCalendarData } from "@/lib/store/calendarData/calendarData.slice";
import { checkEventDayBy } from "@/lib/util/date";
import CalendarDetailItem from "../__components__/CalendarDetailItem";

export default function GroupCalendarDetail() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isAuthenticated, setAuthentication] = useState(false);
  const calendarData = useSelector(selectCalendarData);
  const eventsSortedByTime = calendarData.events
    .filter(checkEventDayBy(router.query.date))
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

  return (
    <>
      <CustomHead
        title={"Calendar Detail"}
        description={"A BillMates calendar detail"}
      />
      <CommonPopup />
      <Header />
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
