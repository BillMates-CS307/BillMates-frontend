import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";

export default function Account({ email }) {
  return (
    <AccountWrapper>
      <AccountTitleWrapper>
        <AccountTitle>Account</AccountTitle>
      </AccountTitleWrapper>
      <AccountLink href="settings/userInformation">User Info</AccountLink>
      <Line />
      <AccountLink href="settings/venmo">Venmo</AccountLink>
      <Line />
      <AccountLink href="settings/user_calendar">Calendar</AccountLink>
    </AccountWrapper>
  );
}

const AccountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
  border-radius: var(--border-radius);
  box-shadow: 1px 2px 3px 0 #949494;
  color: var(--main-background-font-color);
  overflow: hidden;
`;

const AccountTitleWrapper = styled.div`
  padding: 10px;
  width: 100%;
  background: var(--green-background);
  color: var(--main-background-font-color);
`;

const AccountTitle = styled.h3``;

const AccountLink = styled(Link)`
  padding: 5px 20px;
  width: 100%;
`;

const Line = styled.div`
  width: 90%;
  height: 1px;
  border: 1px solid var(--body-background);
`;
