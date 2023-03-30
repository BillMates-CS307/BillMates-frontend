//HTML Imports...
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import Header from '../global_components/groups_header.jsx';
import Footer from '../global_components/footer_no_plus.jsx'; 
import CustomHead from "../global_components/head";
import LoadingCircle from '../global_components/loading_circle.jsx';

import React, { useEffect, useState } from "react";
//import { useStore } from 'react-redux'; //might not be needed
import { useSelector } from 'react-redux'; //replacement for above... fixes refresh
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router.js';
import { user_methods } from '@/lambda_service/userService.js';
import { group_methods } from '@/lambda_service/groupService.js';

//From components...
import MaxCommentLen from "./__components__/max_comment_length_input";
import AllowedFulfillmentOptions from "./__components__/allowed_fulfillment_options";
import AutoApprove from "./__components__/autoapprove_toggle";
import MemberList from "./__components__/member_list";
import SaveQuit from "./__components__/savequit_button";

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

  //get redux state
  //const store = useStore();
  const dispatch = useDispatch();
  const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;
  const groupId = (isAuthenticated) ? window.location.href.match('[a-zA-Z0-9\-]*$')[0] : null;
  
  //const state = store.getState().groupData;

  //API call and populate group information to trigger redraw
  //let response_data = store.getState().groupData; 
  const response_data = useSelector((state) => state.groupData);
  const fetchData = async () => {
      console.log("fetching data");
      let response = await group_methods.getGroupInfo(groupId, userId); //getGroupInfo(groupId, userId);
      if (response.errorType) {
          console.log("An error occured, check logs");
          return;
      } else if (response.success) {
          updated_response_data = response;
          updated_response_data["groupId"] = groupId;
          setLoading(false);
          dispatch(
              groupDataAction.setGroupData(updated_response_data)
          );
      } else {
          //router.push("/home/");
          console.log(response);
      }
      console.log(response);
  }

  //leading circle
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      if (isAuthenticated) {
          fetchData(); //make the call
      }
  }, [isAuthenticated]);
    
  return (
      <>
      <CustomHead title={"Group Settings"} description={"Customize your individual group preferences"}></CustomHead>
        <Header />
        <SettingsWrapper>
          <SettingsForm>
            <h2>Group Settings</h2>
            <MaxCommentLen></MaxCommentLen>
            <AllowedFulfillmentOptions></AllowedFulfillmentOptions>
            <AutoApprove></AutoApprove>
            {response_data.members && (
              <MemberList
                groupMembers={response_data.members}
                groupOwnerId={response_data.manager}
                currentUserId={userId}
              ></MemberList>
            )}
            <SaveQuit />
          </SettingsForm>
          <Space />
        </SettingsWrapper>
        <Footer />
      </>

  );
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
