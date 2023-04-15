import React, { useState, useEffect } from "react";
import { useRouter } from "next/router.js";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
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
import getGroupCalendar from "@/lib/api/getGroupCalendar";
import { calendarDataAction } from "@/lib/store/calendarData/calendarData.slice";
import CalendarContents from "../_components_/CalendarContents";
import LoadingCircle from "../../global_components/loading_circle";

let calendarData = {
  events: [],
};

export default function GroupCalendar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isAuthenticated, setAuthentication] = useState(false);
  const [loading, setLoading] = useState(true);
  const groupData = useSelector(selectGroupData);
  const userId = isAuthenticated ? localStorage.getItem("tempId") : null;

  async function check() {
    let result = await user_methods.validateLoginJWT(router);
    if (result.success) {
      localStorage.setItem("tempId", result.payload.email);
      setAuthentication(true);
    }
  }

  async function fetchData(group_id) {
    console.log("fetching data");
    let lambda_resp = await getGroupCalendar({
      email: userId,
      group_id,
    });
    console.log("resp");
    console.log(lambda_resp);
    if (lambda_resp.token_success && lambda_resp.get_success) {
      calendarData = lambda_resp.events;
      dispatch(calendarDataAction.setCalendarData({ events: calendarData }));
      console.log(calendarData);
    }
    setLoading(false);
  }

  function holdGroupID() {
    if (userId == groupData.manager) {
      router.push("/groupsettings/" + groupData.groupId);
    } else {
      router.push("/groupsettings_members/" + groupData.groupId);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("authenticating");
      check();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(groupData.groupId); //make the call
    }
  }, [isAuthenticated]);

  return (
    <>
      <CustomHead
        title={"Group Calendar"}
        description={"A BillMates group calendar"}
      />
      <CommonPopup />
      <Header groupId={holdGroupID} />
      <CalendarWrapper>
        {loading ? (
          <LoadingCircle
            additionalStyles={{ margin: "15px auto" }}
          ></LoadingCircle>
        ) : (
          <CalendarContents />
        )}
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

const Space = styled.div`
  width: 100%;
  height: 50px;
`;