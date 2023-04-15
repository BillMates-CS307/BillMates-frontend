//HTML Imports...
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import Header, {HEADER_PATHS} from '../global_components/groups_header.jsx';
import Footer from '../global_components/footer_no_plus.jsx'; 
import CustomHead from "../global_components/head";
import LoadingCircle from "../global_components/loading_circle.jsx";

//React + Redux
import React, { useEffect, useState } from "react";
//import { useStore } from 'react-redux'; //might not be needed
import { useSelector } from "react-redux"; //replacement for above... fixes refresh
import { useDispatch } from "react-redux";
import { useRouter } from "next/router.js";
import { user_methods } from "@/lambda_service/userService.js";
import { group_methods } from "@/lambda_service/groupService.js";
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
  };
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("authenticating");
      check();
    }
  }, [isAuthenticated]); //not being used here

  //API call and populate group information to trigger redraw

  //get redux state
  const dispatch = useDispatch();
  const userId = isAuthenticated ? localStorage.getItem("tempId") : null;
  const groupId = isAuthenticated
    ? window.location.href.match("[a-zA-Z0-9-]*$")[0]
    : null;
  const [response_data, setResponseData] = useState({
    groupId: "",
    name: "",
    members: {},
    expenses: [],
    pending: [],
    balance: 0.0,
    manager: "",
    maxComment: 0, //changed from 0, set 200 as default
    settings: {},
  });
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
  };

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

  const setBillmatesChecked = () => {
    console.log();
  };

  const saveSettings = async () => {
    const payment_type = document.querySelector("#payments").value;
    const maxChar = document.querySelector("#comment").value;
    const parsed = parseInt(maxChar);
    console.log(parsed);
    if (isNaN(parsed) || parsed > 200 || parsed < 0) {
      alert("Must be between 0 and 200 characters");
      return;
    }

    const auto_approve = document.querySelector("#auto-approve-toggle").checked;

    const save_response = await group_methods.updateGroupSettings(
      groupId,
      payment_type,
      auto_approve,
      maxChar
    );

    if (save_response.errorType) {
      console.log(save_response.errorMessage);
      alert("An error occured, please try again later");
      return;
    } else if (!save_response.success) {
      alert("Didn't save");
      return;
    } else {
      alert("Saved");
      return;
    }
  };

  const kickUser = async (e, userId) => {
    e.preventDefault();
    const kick_response = await group_methods.kickUserFromGroup(
      groupId,
      userId
    );
    console.log(kick_response);
    if (kick_response.errorType) {
      console.log(kick_response.errorMessage);
      alert("An error occured, please try again later");
      return;
    } else if (!kick_response.success) {
      alert("Didn't kick");
      return;
    } else {
      router.reload();
      return;
    }
  };

  const resetGroup = async (e) => {
    e.preventDefault();
    const reset_response = await group_methods.resetGroup(groupId);
    console.log(reset_response);
    if (reset_response.errorType) {
      console.log(reset_response.errorMessage);
      alert("An error occured, please try again later");
      return;
    } else if (!reset_response.success) {
      alert("Didn't reset");
      return;
    } else {
      router.reload();
      return;
    }
  };

  const deleteGroup = async (e) => {
    e.preventDefault();
    const delete_response = await group_methods.deleteGroup(groupId);
    console.log(delete_response);
    if (delete_response.errorType) {
      console.log(delete_response.errorMessage);
      alert("An error occured, please try again later");
      return;
    } else if (!delete_response.success) {
      alert("Didn't delete");
      return;
    } else {
      router.reload();
      return;
    }
  };

  const archiveGroup = async (e) => {
    e.preventDefault();
    const archive_response = await group_methods.archiveGroup(groupId);
    console.log(archive_response);
    if (archive_response.errorType) {
      console.log(archive_response.errorMessage);
      alert("An error occured, please try again later");
      return;
    } else if (!archive_response.success) {
      alert("Didn't reset");
      return;
    } else {
      router.reload();
      return;
    }
  };
  function isGroupManager() {
    return true;
  }

  if (isAuthenticated) {
    return (
      <>
        <CustomHead
          title={"Group Settings"}
          description={"Customize your individual group preferences"}
        ></CustomHead>
        <Header loading={loading} selected={HEADER_PATHS.ANALYTICS|HEADER_PATHS.CALENDAR|HEADER_PATHS.SETTINGS|HEADER_PATHS.SHOPPINGLIST|HEADER_PATHS.GROUP}
                getManagerStatus={isGroupManager} groupPath={window.location.href.match(".+?(?=etting)")[0] + "/" + window.location.href.match("[a-zA-Z0-9\-]*$")[0]}>
        </Header>
        <SettingsWrapper>
          <SettingsForm>
            <h2>Group Settings</h2>
            <MaxCommentLen
              options={response_data.settings.max_char}
            ></MaxCommentLen>
            <AllowedFulfillmentOptions
              options={response_data.settings.fufillment}
            ></AllowedFulfillmentOptions>
            <AutoApprove
              options={response_data.settings.auto_approve}
            ></AutoApprove>
            <MemberList
              groupMembers={response_data.members}
              groupOwnerId={response_data.manager}
              currentUserId={userId}
              onKickUser={kickUser}
            ></MemberList>
            {/* <CalendarLink href={`/groups/group_calendar/${router.query.id}`}>
              Calendar
            </CalendarLink> */}
            <button
              onClick={(e) => {
                deleteGroup(e);
              }}
            >
              {" "}
              Delete group
            </button>
            <button
              onClick={(e) => {
                resetGroup(e);
              }}
            >
              Reset Group
            </button>
            <button
              onClick={(e) => {
                archiveGroup(e);
              }}
            >
              Archive Group
            </button>
            <SaveQuit saveData={saveSettings} />
          </SettingsForm>
          <Space />
        </SettingsWrapper>
        <Footer />
      </>
    );
  } else {
    return <></>;
  }
}

const SettingsWrapper = styled.div`
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
  height: 40px;
`;

const SettingsForm = styled.form``;

// const CalendarLink = styled(Link)`
//   display: flex;
//   margin-top: 20px;
//   text-align: center;
//   padding: 10px;
//   width: 100px;
//   border-radius: var(--border-radius);
//   box-shadow: 1px 2px 3px 0 #949494;
//   background: #00c923;
//   color: var(--main-background-font-color);
//   font-weight: bold;
// `;
