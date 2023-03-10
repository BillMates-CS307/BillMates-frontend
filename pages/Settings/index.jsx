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
import Header from "../globals/Header";
import Footer from "../Refactored/Global_components/footer.jsx";
import LogoutSection from "./__components__/LogoutSection";
import { userService } from "../services/authorization";

export async function getServerSideProps({req, res}) {
  const {email, token} = userService.getEmailFromToken({req, res});
  if (email == null) {
    return {props : {},
            redirect : {permanent: false,
            destination: "/"} }
  }
  return {props: {email : email}}
}

export default function Settings({email}) {
  const { theme } = useTheme();
  console.log(email);
  return (
    <>
      <Header />
      <SettingsWrapper theme={theme}>
        <SettingsForm>
          <UserInformation email={email}/>
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
    margin-bottom: 50px;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 1px 2px 15px 0 #949494;
    color: ${theme === THEME.LIGHT ? "black" : "white"};
    background: ${theme === THEME.LIGHT ? "white" : "black"};
  `}
`;

const SettingsForm = styled.form``;
