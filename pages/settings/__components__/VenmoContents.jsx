import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import {
  userDataAction,
  selectUserData,
} from "@/lib/store/userData/userData.slice";
import BulletLayout from "./BulletLayout";

export default function VenmoContents({ email }) {
  const dispatch = useDispatch();

  const onEmailBlurHandler = (e) => {
    dispatch(
      userDataAction.setVenmoEmail({ venmoEmail: e.currentTarget.value })
    );
  };

  const onPasswordBlurHandler = (e) => {
    dispatch(
      userDataAction.setVenmoPassword({
        venmoPassword: e.currentTarget.value,
      })
    );
  };

  const onTokenBlurHandler = (e) => {
    dispatch(
      userDataAction.setVenmoSMSCode({
        venmoToken: e.currentTarget.value,
      })
    );
  };

  return (
    <VenmoWrapper>
      <VenmoTitleWrapper>
        <VenmoTitle>Link Venmo</VenmoTitle>
      </VenmoTitleWrapper>

      <VenmoInputSectionWrapper marginTop={10}>
        <VenmoInputLabel>email</VenmoInputLabel>
        <VenmoInputWrapper>
          <VenmoInput
            type="text"
            name="email"
            required
            minlength="1"
            maxlength="20"
            onBlur={onEmailBlurHandler}
          />
        </VenmoInputWrapper>
      </VenmoInputSectionWrapper>
      <VenmoInputSectionWrapper marginTop={5}>
        <VenmoInputLabel>password</VenmoInputLabel>
        <VenmoInputWrapper>
          <VenmoInput
            type="password"
            name="password"
            required
            minlength="1"
            maxlength="20"
            onBlur={onPasswordBlurHandler}
          />
        </VenmoInputWrapper>
      </VenmoInputSectionWrapper>
    </VenmoWrapper>
  );
}

const VenmoWrapper = styled.div`
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

const VenmoTitleWrapper = styled.div`
  padding: 10px;
  width: 100%;
  background: var(--green-background);
  color: var(--main-background-font-color);
`;

const VenmoTitle = styled.h3``;

const VenmoInputSectionWrapper = styled.div`
  ${({ marginTop }) => css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: ${marginTop}px;
    padding: 0 10px 0 10px;
    width: 100%;
  `}
`;

const VenmoInputLabel = styled.div`
  display: flex;
  align-items: start;
  padding-top: 10px;
  max-width: 67px;
`;

const VenmoInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 314px;
  margin-left: 10px;
`;

const SpaceBetween = styled.div`
  height: 18px;
`;

const VenmoInput = styled.input`
  height: 40px;
  padding: 3px 5px;
  padding-right: 1.5rem;
  border-radius: 5px;
  border: 1px solid #9e9e9e;
  :focus {
    outline: 1px solid #00c923;
  }
`;
