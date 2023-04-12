//HTML Imports...
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import Header, {HEADER_PATHS} from '../global_components/groups_header.jsx';
import Footer from '../global_components/footer_no_plus.jsx'; 
import CustomHead from "../global_components/head";
import LoadingCircle from '../global_components/loading_circle.jsx';

//React + Redux
import React, { useEffect, useState } from "react";
//import { useStore } from 'react-redux'; //might not be needed
import { useSelector } from 'react-redux'; //replacement for above... fixes refresh
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router.js';
import { user_methods } from '@/lambda_service/userService.js';
import { group_methods } from '@/lambda_service/groupService.js';
import { groupDataAction } from "@/lib/store/groupData.slice.js";

//From components...
import MaxCommentLen from "./__components__/max_comment_length_input";
import AllowedFulfillmentOptions from "./__components__/allowed_fulfillment_options";
import AutoApprove from "./__components__/autoapprove_toggle";
import MemberList from "./__components__/member_list";
import SaveQuit from "./__components__/savequit_button";
import { set } from "lodash";

export default function GroupSettings() {
  const router = useRouter();
  const [isAuthenticated, setAuthentication] = useState(false);
  const check = async () => {
    let result = await user_methods.validateLoginJWT(router);
    if (result.success) {
      localStorage.setItem("tempId", result.payload.email);
      setAuthentication(true);
    } else {
      router.replace("/");
      return;
    }
  }
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("authenticating");
      check();
    }
  }, [isAuthenticated]) //not being used here

  //API call and populate group information to trigger redraw

  //get redux state
  const dispatch = useDispatch();
  const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;
  const groupId = (isAuthenticated) ? window.location.href.match('[a-zA-Z0-9\-]*$')[0] : null;
  const [response_data, setResponseData] = useState({groupId : "",
  name : "",
  members : {},
  expenses: [],
  pending : [],
  balance : 0.00,
  manager : "",
  maxComment : 0, //changed from 0, set 200 as default
  settings : {}});
  const fetchData = async () => {
      console.log("fetching data");
      let response = await group_methods.getGroupInfo(groupId, userId);
      if (response.errorType) {
          console.log("An error occured, check logs");
          return;
      } else if (response.success) {
          response["groupId"] = groupId;
          setResponseData(response);
          setLoading(false);
      } else {
          console.log(response);
          router.push("/home/");
      }
      console.log(response);
  }

  //loading circle
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      if (isAuthenticated) {
          fetchData(); //make the call
          console.log(response_data);
      }
  }, [isAuthenticated]);

  // const [billmatesChecked, setBillmatesChecked] = useState(true);
  // const [venmoChecked, setVenmoChecked] = useState(true);
  // const [autoApproved, setAutoApproved] = useState(true);
  // const [comment, setCommentChange] = useState('200');

  function isGroupManager() {
    return false;
  }
  if (isAuthenticated) {
    return (
        <>
        <CustomHead title={"Group Settings"} description={"Customize your individual group preferences"}></CustomHead>
        <Header loading={loading} selected={HEADER_PATHS.ANALYTICS|HEADER_PATHS.CALENDAR|HEADER_PATHS.SETTINGS|HEADER_PATHS.SHOPPINGLIST|HEADER_PATHS.GROUP}
                getManagerStatus={isGroupManager} groupPath={window.location.href.match(".+?(?=etting)")[0] + "/" + window.location.href.match("[a-zA-Z0-9\-]*$")[0]}></Header>
          <SettingsWrapper>
            <SettingsForm>
              <h2>Group Settings</h2>
              <MaxCommentLen options = {response_data.settings.max_char}></MaxCommentLen>
              <AllowedFulfillmentOptions options = {response_data.settings.fufillment}></AllowedFulfillmentOptions>
              <AutoApprove options = {response_data.settings.auto_approve}></AutoApprove>
                <MemberList
                  groupMembers = {response_data.members}
                  groupOwnerId = {response_data.manager}
                  currentUserId = {userId}
                ></MemberList>
            </SettingsForm>
            <Space />
          </SettingsWrapper>
          <Footer />
        </>
    );
  } else {
    return <></>
  }
}

const SettingsWrapper = styled.div`
    max-width: 700px;
    width : 90%;
    margin: 0 auto;
    padding: 1rem;
    border-radius: var(--border-radius);
    box-shadow: 1px 2px 15px 0 #949494;
    color: var(--main-background-font-color);
    background: var(--main-background);
`;

const Space = styled.div`
  width: 100%;
  height: 40px;
`;

const SettingsForm = styled.form``;
