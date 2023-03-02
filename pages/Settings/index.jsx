import React from "react";
import styled from "@emotion/styled";
import UserInformation from "./__components__/UserInformation";
import Notification from "./__components__/Notification";
import PaymentPreference from "./__components__/PaymentPreference";
import SubmitButton from "./__components__/SubmitButton";
import Theme from "./__components__/Theme";
import Header from "../Globals/Header";
import Footer from "../Globals/Footer";
import LogoutSection from "./__components__/LogoutSection";

export default function Settings() {
  return (
    <>
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
      </SettingsWrapper>
      <Footer />
    </>
  );
}

const SettingsWrapper = styled.div`
  max-width: 440px;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 1px 2px 15px 0 #949494;
  background: #fff;
`;

const SettingsForm = styled.form``;
