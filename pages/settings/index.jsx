import React from "react";
import styled from "@emotion/styled";
import { useDispatch } from "react-redux";
import { userDataAction } from "@/lib/store/userData/userData.slice";
import Header from "../global_components/header.jsx";
import Footer from "../global_components/footer_no_plus.jsx";
import Account from "./__components__/Account";
import Notification from "./__components__/Notification";
import PaymentPreference from "./__components__/PaymentPreference";
import SubmitButton from "./__components__/SubmitButton";
import Theme from "./__components__/Theme";
import LogoutSection from "./__components__/LogoutSection";
import CustomHead from "../global_components/head";
import { CommonPopup } from "@/lib/ui/CommonPopup.jsx";

export default function Settings() {
  const dispatch = useDispatch();
  const onClickSubmitHandler = async (e) => {
    e.preventDefault();
    dispatch(userDataAction.requestFlowChangeSettings());
  };
  return (
    <>
      <CustomHead
        title={"User Information"}
        description={"Place to customize your BillMate preferences"}
      ></CustomHead>
      <CommonPopup />
      <Header />
      <SettingsWrapper>
        <SettingsForm>
          <Account />
          <Notification />
          <PaymentPreference />
          <Theme />
          <SubmitButton
            text="Submit"
            onClickSubmitHandler={onClickSubmitHandler}
          />
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
  height: 50px;
`;

const SettingsForm = styled.form``;
