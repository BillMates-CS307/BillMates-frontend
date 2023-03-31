//HTML Imports...
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import Header from '../global_components/groups_header.jsx';
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
  let response_data = useSelector((state) => state.groupData); //grabs settings from specific group

  //get redux state
  const dispatch = useDispatch();
  const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;
  //const groupId = (isAuthenticated) ? response_data.groupId : null;
  const groupId = (isAuthenticated) ? window.location.href.match('[a-zA-Z0-9\-]*$')[0] : null;
  //console.log("what the fuck: " + JSON.stringify(response_data)); //debugging..

  const fetchData = async () => {
      console.log("fetching data");
      console.log("groupID pls: " + groupId);
      let response = await group_methods.getGroupInfo(groupId, userId);
      if (response.errorType) {
          console.log("An error occured, check logs");
          return;
      } else if (response.success) {
          response_data = response;
          response_data["groupId"] = groupId;
          response_data["settings"] = response.settings;
          setLoading(false);
          setBillmatesChecked(response_data.settings.fufillment == "both" || response_data.settings.fufillment == "billmates");
          setVenmoChecked(response_data.settings.fufillment == "both" || response_data.settings.fufillment == "venmo");
          setAutoApproved(response_data.settings.auto_approve == false);
          setCommentChange(response_data.settings.max_char == 200);

          dispatch(
              groupDataAction.setGroupData(response_data)
          );
      } else {
          //router.push("/home/");
          console.log(response);
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

  function onChange(options) {
    
  }
  const [billmatesChecked, setBillmatesChecked] = useState(true);
  const [venmoChecked, setVenmoChecked] = useState(true);
  const [autoApproved, setAutoApproved] = useState(true);
  const [comment, setCommentChange] = useState('200');
  
  if (isAuthenticated) {
    return (
        <>
        <CustomHead title={"Group Settings"} description={"Customize your individual group preferences"}></CustomHead>
          <Header />
          <SettingsWrapper>
            <SettingsForm>
              <h2>Group Settings</h2>
              <MaxCommentLen setCommentChange = {setCommentChange} options = {response_data.settings.max_char}></MaxCommentLen>
              <AllowedFulfillmentOptions setBillmatesChecked={setBillmatesChecked} setVenmoChecked = {setVenmoChecked} options = {response_data.settings.fufillment}></AllowedFulfillmentOptions>
              <AutoApprove setAutoApproved = {setAutoApproved} options = {response_data.settings.auto_approve}></AutoApprove>
              {response_data.members && (
                <MemberList
                  groupMembers = {response_data.members}
                  groupOwnerId = {response_data.manager}
                  currentUserId = {userId}
                ></MemberList>
              )}
              <button onClick={response_data.settings.leave_group}> Leave group</button>
              <button onClick={response_data.settings.reset_group}>Reset Group</button>
              <SaveQuit />
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
