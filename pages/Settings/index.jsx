import React from "react";
import styled from "@emotion/styled";
import UserInformation from "./__components__/UserInformation";
import Notification from "./__components__/Notification";
import PaymentPreference from "./__components__/PaymentPreference";
import SubmitButton from "./__components__/SubmitButton";

export default function Settings() {
  return (
    <SettingsWrapper>
      <SettingsForm>
        <UserInformation />
        <Notification />
        <PaymentPreference />
        <SubmitButton />
      </SettingsForm>
    </SettingsWrapper>
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
