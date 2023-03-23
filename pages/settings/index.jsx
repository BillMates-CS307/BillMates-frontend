import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import UserInformation from "./__components__/UserInformation";
import Notification from "./__components__/Notification";
import PaymentPreference from "./__components__/PaymentPreference";
import SubmitButton from "./__components__/SubmitButton";
import Theme from "./__components__/Theme";
import Header from '../global_components/header.jsx'
import Footer from '../global_components/footer_no_plus.jsx'
import LogoutSection from "./__components__/LogoutSection";
import CustomHead from "../global_components/head";

export default function Settings() {
  return (
    <>
    <CustomHead title={"User Settings"} description={"Place to customize your BillMate preferences"}></CustomHead>
      <Header />
      <SettingsWrapper>
        <SettingsForm>
          <UserInformation />
          <Notification />
          <PaymentPreference />
          <Theme />
          <SubmitButton />
        </SettingsForm>
        <LogoutSection />
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
