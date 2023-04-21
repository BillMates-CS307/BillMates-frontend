import React, { useState, useEffect } from "react";
import { useRouter } from "next/router.js";
import Link from "next/link";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserData,
  userDataAction,
} from "@/lib/store/userData/userData.slice";
import { user_methods } from "@/lambda_service/userService";
import Header, { HEADER_PATHS } from "@/pages/global_components/groups_header";
import Footer from "@/pages/global_components/footer";
import CustomHead from "@/pages/global_components/head";
import { CommonPopup } from "@/lib/ui/CommonPopup";
import { selectGroupData } from "@/lib/store/groupData.slice";
import getGroupCalendar from "@/lib/api/getGroupCalendar";
import {
  calendarDataAction,
  selectIsGroupCalendar,
} from "@/lib/store/calendarData/calendarData.slice";
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
  const isGroupCalendar = useSelector(selectIsGroupCalendar);
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

  function isManager() {
    return true;
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
      <Header groupPath={"../" + groupData.groupId} selected={HEADER_PATHS.ANALYTICS | HEADER_PATHS.SETTINGS | HEADER_PATHS.GROUP | HEADER_PATHS.RECURRING | HEADER_PATHS.SHOPPINGLIST} 
      getManagerStatus={isManager}/>
      <CalendarWrapper>
        {loading ? (
          <LoadingCircle
            additionalStyles={{ margin: "15px auto" }}
          ></LoadingCircle>
        ) : (
          <>
            <CalendarContents />
            <LinkWrapper>
              <AddLink href={`/groups/event_form/${groupData.groupId}`}>
                +
              </AddLink>
            </LinkWrapper>
          </>
        )}
        <Space />
      </CalendarWrapper>
      <Footer />
    </>
  );
}

const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 700px;
  width: 90%;
  margin: 0 auto;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: 1px 2px 15px 0 #949494;
  color: var(--main-background-font-color);
  background: var(--main-background);
`;

const LinkWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 50px;
  padding: 10px 20px;
`;

const AddLink = styled(Link)`
  padding: 5px;
  background-color: var(--green-background);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;

  :hover {
    cursor: pointer;
  }
`;

const Space = styled.div`
  width: 100%;
  height: 50px;
`;
