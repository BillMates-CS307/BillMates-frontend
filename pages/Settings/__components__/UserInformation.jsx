import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useDispatch } from "react-redux";
import { userDataAction } from "@/lib/store/userData.slice";
import BulletLayout from "./BulletLayout";

export default function UserInformation() {
  const dispatch = useDispatch();
  const [isWrongName, setIsWrongName] = useState(false);
  const [isNameClicked, setIsNameClicked] = useState(false);
  const [nameDescription, setNameDescription] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [isPasswordClicked, setIsPasswordClicked] = useState(false);
  const [passwordDescription, setPasswordDescription] = useState("");

  const onNameBlurHandler = (e) => {
    setIsNameClicked(false);

    if (e.currentTarget.value.length < 1) {
      setIsWrongName(true);
      setNameDescription("wrong name");
      return;
    }

    dispatch(userDataAction.setName({ name: e.currentTarget.value }));
    setIsWrongName(false);
  };

  const onNameClickHandler = (e) => {
    setIsNameClicked(true);
  };

  const onPasswordBlurHandler = (e) => {
    setIsPasswordClicked(false);
    if (
      e.currentTarget.value.search(/(?=(.*[a-z]){3,})/g) == -1 ||
      e.currentTarget.value.search(/(?=(.*[A-Z]){3,})/g) == -1 ||
      e.currentTarget.value.search(/(?=(.*[0-9]){3,})/g) == -1 ||
      e.currentTarget.value.search(/(?=(.*[?#@!*()])+)/g) == -1 ||
      e.currentTarget.value == "" ||
      e.currentTarget.value.length < 5
    ) {
      setIsWrongPassword(true);
      setPasswordDescription("wrong password");
      return;
    }

    dispatch(
      userDataAction.setChangedPassword({
        changedPassword: e.currentTarget.value,
      })
    );
    setIsWrongPassword(false);
  };

  const onPasswordClickHandler = (e) => {
    setIsPasswordClicked(true);
  };

  return (
    <UserInformationWrapper>
      <UserInformationTitleWrapper>
        <UserInformationTitle>User Information</UserInformationTitle>
      </UserInformationTitleWrapper>

      <UserInformationInputSectionWrapper marginTop={10}>
        <UserInformationInputLabel>name</UserInformationInputLabel>
        <UserInformationInputWrapper>
          <UserInformationInput
            type="text"
            name="name"
            required
            minlength="1"
            maxlength="20"
            onBlur={onNameBlurHandler}
            onClick={onNameClickHandler}
          />
          {isWrongName && !isNameClicked ? (
            <BulletLayout description={nameDescription} />
          ) : (
            <SpaceBetween />
          )}
        </UserInformationInputWrapper>
      </UserInformationInputSectionWrapper>
      <UserInformationInputSectionWrapper marginTop={5}>
        <UserInformationInputLabel>password</UserInformationInputLabel>
        <UserInformationInputWrapper>
          <UserInformationInput
            type="text"
            name="password"
            required
            minlength="1"
            maxlength="20"
            onBlur={onPasswordBlurHandler}
            onClick={onPasswordClickHandler}
          />
          {isWrongPassword && !isPasswordClicked ? (
            <BulletLayout description={passwordDescription} />
          ) : (
            <SpaceBetween />
          )}
        </UserInformationInputWrapper>
      </UserInformationInputSectionWrapper>
    </UserInformationWrapper>
  );
}

const UserInformationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
  border-radius: 10px;
  box-shadow: 1px 2px 3px 0 #949494;
  color: black;
  overflow: hidden;
`;

const UserInformationTitleWrapper = styled.div`
  padding: 10px;
  width: 100%;
  background: #00c923;
  color: white;
`;

const UserInformationTitle = styled.h3``;

const UserInformationInputSectionWrapper = styled.div`
  ${({ marginTop }) => css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: ${marginTop}px;
    padding: 0 10px 0 10px;
    width: 100%;
  `}
`;

const UserInformationInputLabel = styled.div`
  display: flex;
  align-items: start;
  padding-top: 10px;
`;

const UserInformationInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 314px;
  margin-left: 10px;
`;

const SpaceBetween = styled.div`
  height: 18px;
`;

const UserInformationInput = styled.input`
  height: 40px;
  padding: 3px 5px;
  padding-right: 1.5rem;
  border-radius: 5px;
  border: 1px solid #9e9e9e;

  :focus {
    outline: 1px solid #00c923;
  }
`;
