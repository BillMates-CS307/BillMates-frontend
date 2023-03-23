import React from "react";
import styled from "@emotion/styled";
import Header from "@/pages/global_components/header";
import Footer from "@/pages/global_components/footer";
import CustomHead from "@/pages/global_components/head";
import UserInformationContents from "../__components__/UserInformationContents";
import SubmitButton from "../__components__/SubmitButton";

export default function UserInformation() {
  return (
    <>
    <CustomHead title={"User Settings"} description={"Place to customize your BillMate preferences"}></CustomHead>
      <Header />
      <UserInformationWrapper>
        <UserInformationContents/>
        <SubmitButton />
        <Space />
      </UserInformationWrapper>
      <Footer />
    </>
  );
}

const UserInformationWrapper = styled.div`
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
  height: 50px;
`;

const SettingsForm = styled.form``;
