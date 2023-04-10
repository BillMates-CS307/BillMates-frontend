import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { isEmpty, isNil } from "lodash";

export default function CalendarDetailItem({
  title,
  comment,
  owner,
  users,
  amount,
  recurring,
  date,
  time,
  location,
}) {
  return (
    <CalendarDetailItemWrapper>
      <CalendarDetailItemTitleWrapper>
        <CalendarDetailItemTitle>{title}</CalendarDetailItemTitle>
      </CalendarDetailItemTitleWrapper>
      <CalendarDetailItemContentsWrapper>
        <CalendarDetailItemOwnerWrapper>{owner}</CalendarDetailItemOwnerWrapper>
        <CalendarDetailItemCommentWrapper>
          {comment}
        </CalendarDetailItemCommentWrapper>
        {!isNil(users) && !isEmpty(users) && (
          <CalendarDetailItemUsersWrapper>
            {users.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </CalendarDetailItemUsersWrapper>
        )}
      </CalendarDetailItemContentsWrapper>
      {!isNil(amount) && (
        <CalendarDetailItemAmountWrapper>
          ${amount}
        </CalendarDetailItemAmountWrapper>
      )}
      {!isNil(location) && (
        <CalendarDetailItemLocationWrapper>
          {`location: ${location}`}
        </CalendarDetailItemLocationWrapper>
      )}
      <CalendarDetailItemDateTimeWrapper>{`${date} ${time}`}</CalendarDetailItemDateTimeWrapper>
    </CalendarDetailItemWrapper>
  );
}

const CalendarDetailItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-radius: var(--border-radius);
  box-shadow: 1px 2px 3px 0 #949494;
  color: var(--main-background-font-color);
  overflow: hidden;
`;

const CalendarDetailItemTitleWrapper = styled.div`
  padding: 10px;
  width: 100%;
  background: var(--green-background);
  color: var(--main-background-font-color);
`;

const CalendarDetailItemTitle = styled.h3``;

const CalendarDetailItemContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 10px;
  margin-top: 10px;
  width: 100%;
`;

const CalendarDetailItemOwnerWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 5px;
  width: 100%;
`;

const CalendarDetailItemCommentWrapper = styled.div`
  padding-top: 5px;
`;

const CalendarDetailItemUsersWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 20px;
  padding-top: 5px;
`;

const CalendarDetailItemAmountWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-right: 5px;
  padding-top: 5px;
`;

const CalendarDetailItemLocationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
  padding-top: 5px;
  width: 100%;
`;

const CalendarDetailItemDateTimeWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
  padding-top: 5px;
  width: 100%;
`;
