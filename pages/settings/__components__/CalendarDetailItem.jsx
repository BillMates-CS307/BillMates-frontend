import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { isEmpty, isNil } from "lodash";

export default function CalendarDetailItem({
  creator,
  name,
  description,
  date,
  time,
  expense,
  total,
  location,
  group_name,
}) {
  return (
    <CalendarDetailItemWrapper>
      <CalendarDetailItemNameWrapper>
        <CalendarDetailItemName>{name}</CalendarDetailItemName>
        <CalendarDetailRemoveButton>X</CalendarDetailRemoveButton>
      </CalendarDetailItemNameWrapper>
      <CalendarDetailItemContentsWrapper>
        <CalendarDetailItemCreatorWrapper>
          {`creator: ${creator}`}
        </CalendarDetailItemCreatorWrapper>
        {!isNil(group_name) && (
          <CalendarDetailItemCreatorWrapper>
            {`group: ${group_name}`}
          </CalendarDetailItemCreatorWrapper>
        )}
        <CalendarDetailItemDescriptionWrapper>
          <div>Description</div>
          {description}
        </CalendarDetailItemDescriptionWrapper>
        {!isNil(expense) && !isEmpty(Object.keys(expense)) && (
          <CalendarDetailItemUsersWrapper>
            {Object.keys(expense).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </CalendarDetailItemUsersWrapper>
        )}
      </CalendarDetailItemContentsWrapper>
      {!isNil(total) && (
        <CalendarDetailItemAmountWrapper>
          ${total}
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

const CalendarDetailItemNameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  width: 100%;
  background: var(--green-background);
  color: var(--main-background-font-color);
`;

const CalendarDetailItemName = styled.h3``;

const CalendarDetailRemoveButton = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  padding-right: 5px;
`;

const CalendarDetailItemContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 10px;
  margin-top: 10px;
  width: 100%;
`;

const CalendarDetailItemCreatorWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 5px;
  width: 100%;
`;

const CalendarDetailItemDescriptionWrapper = styled.div`
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
