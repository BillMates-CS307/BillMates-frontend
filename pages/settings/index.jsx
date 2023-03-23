import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useTheme } from "next-themes";
import { THEME } from "@/lib/constants";
import UserInformation from "./__components__/UserInformation";
import Notification from "./__components__/Notification";
import PaymentPreference from "./__components__/PaymentPreference";
import SubmitButton from "./__components__/SubmitButton";
import Theme from "./__components__/Theme";
import Header from '../global_components/header.jsx'
import Footer from '../global_components/footer.jsx'
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
        <Space />
      </SettingsWrapper>
      <Footer />
    </>
  );
}

const SettingsWrapper = styled.div`
  ${({ theme }) => css`
    max-width: 440px;
    margin: 0 auto;
    padding: 1rem;
    border-radius: var(--border-radius);
    box-shadow: 1px 2px 15px 0 #949494;
    color: var(--main-background-font-color);
    background: var(--main-background);
  `}
`;

const Space = styled.div`
  width: 100%;
  height: 40px;
`;

const SettingsForm = styled.form``;
