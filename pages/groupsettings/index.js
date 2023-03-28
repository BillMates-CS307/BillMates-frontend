import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import Header from '../global_components/groups_header.jsx'; //y
import Footer from '../global_components/footer_no_plus.jsx'; //y
import CustomHead from "../global_components/head";

//From components...
import MaxCommentLen from "./__components__/max_comment_length_input";
import AllowedFulfillmentOptions from "./__components__/allowed_fulfillment_options";
import AutoApprove from "./__components__/autoapprove_toggle";
import MemberList from "./__components__/member_list";

export default function Settings() {
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
          <MemberList></MemberList>
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
