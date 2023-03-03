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
import Header from "../Globals/Header";
import Footer from "../Globals/Footer";
import LogoutSection from "./__components__/LogoutSection";

export default function Settings() {
  const { theme } = useTheme();
  return (
    <>
      <Header />
      <SettingsWrapper theme={theme}>
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
  ${({ theme }) => css`
    max-width: 440px;
    margin: 0 auto;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 1px 2px 15px 0 #949494;
    color: ${theme === THEME.LIGHT ? "black" : "white"};
    background: ${theme === THEME.LIGHT ? "white" : "black"};
  `}
`;

const SettingsForm = styled.form``;
