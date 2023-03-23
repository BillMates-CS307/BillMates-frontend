import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useTheme } from "next-themes";
import { useDispatch } from "react-redux";
import { userDataAction } from "@/lib/store/userData.slice";
import BulletLayout from "./BulletLayout";

export default function UserInformationContents({email}) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [isWrongName, setIsWrongName] = useState(false);
  const [isNameClicked, setIsNameClicked] = useState(false);
  const [nameDescription, setNameDescription] = useState("");
  const [isWrongOldPassword, setIsWrongOldPassword] = useState(false);
  const [isOldPasswordClicked, setOldIsPasswordClicked] = useState(false);
  const [oldPasswordDescription, setOldPasswordDescription] = useState("");
  const [isWrongNewPassword, setIsWrongNewPassword] = useState(false);
  const [isNewPasswordClicked, setNewIsPasswordClicked] = useState(false);
  const [newPasswordDescription, setNewPasswordDescription] = useState("");
  const [isWrongNewPasswordConfirm, setIsWrongNewPasswordConfirm] = useState(false);
  const [isNewPasswordClickedConfirm, setNewIsPasswordClickedConfirm] = useState(false);
  const [newPasswordDescriptionConfirm, setNewPasswordDescriptionConfirm] = useState("");


  dispatch(
    userDataAction.setEmail({
      email: email,
    })
  );

  const onNameBlurHandler = (e) => {
    setIsNameClicked(false);

    // if (e.currentTarget.value.length < 1) {
    //   setIsWrongName(true);
    //   setNameDescription("");
    //   return;
    // }

    dispatch(userDataAction.setName({ name: e.currentTarget.value }));
    setIsWrongName(false);
  };

  const onNameClickHandler = (e) => {
    setIsNameClicked(true);
  };

  const onOldPasswordBlurHandler = (e) => {
    setOldIsPasswordClicked(false);
    if (
      e.currentTarget.value.search(/(?=(.*[a-z]){3,})/g) == -1 ||
      e.currentTarget.value.search(/(?=(.*[A-Z]){3,})/g) == -1 ||
      e.currentTarget.value.search(/(?=(.*[0-9]){3,})/g) == -1 ||
      e.currentTarget.value.search(/(?=(.*[?#@!*()])+)/g) == -1 ||
      e.currentTarget.value == "" ||
      e.currentTarget.value.length < 10
    ) {
      setIsWrongOldPassword(true);
      setOldPasswordDescription("password not strong enough");
      return;
    }

    dispatch(
      userDataAction.setOldPassword({
        oldPassword: e.currentTarget.value,
      })
    );
    setIsWrongOldPassword(false);
  };

  const onOldPasswordClickHandler = (e) => {
    setOldIsPasswordClicked(true);
  };

  const onNewPasswordBlurHandlerConfirm = (e) => {
    setNewIsPasswordClickedConfirm(false);
    if (
      e.currentTarget.value.search(/(?=(.*[a-z]){3,})/g) == -1 ||
      e.currentTarget.value.search(/(?=(.*[A-Z]){3,})/g) == -1 ||
      e.currentTarget.value.search(/(?=(.*[0-9]){3,})/g) == -1 ||
      e.currentTarget.value.search(/(?=(.*[?#@!*()])+)/g) == -1 ||
      e.currentTarget.value == "" ||
      e.currentTarget.value.length < 10
    ) {
      setIsWrongNewPasswordConfirm(true);
      setNewPasswordDescriptionConfirm("password not strong enough");
      return;
    }

    dispatch(
      userDataAction.setNewPassword({
        newPassword: e.currentTarget.value,
      })
    );
    setIsWrongNewPasswordConfirm(false);
  };

  const onNewPasswordClickHandlerConfirm = (e) => {
    setNewIsPasswordClickedConfirm(true);
  };
  const onNewPasswordBlurHandler = (e) => {
    setNewIsPasswordClicked(false);
    if (
      e.currentTarget.value.search(/(?=(.*[a-z]){3,})/g) == -1 ||
      e.currentTarget.value.search(/(?=(.*[A-Z]){3,})/g) == -1 ||
      e.currentTarget.value.search(/(?=(.*[0-9]){3,})/g) == -1 ||
      e.currentTarget.value.search(/(?=(.*[?#@!*()])+)/g) == -1 ||
      e.currentTarget.value == "" ||
      e.currentTarget.value.length < 5
    ) {
      setIsWrongNewPassword(true);
      setNewPasswordDescription("password not strong enough");
      return;
    }

    dispatch(
      userDataAction.setNewPassword({
        newPassword: e.currentTarget.value,
      })
    );
    setIsWrongNewPassword(false);
  };

  const onNewPasswordClickHandler = (e) => {
    setNewIsPasswordClicked(true);
  };
  return (
    <UserInformationWrapper theme={theme}>
      <UserInformationTitleWrapper theme={theme}>
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
        <UserInformationInputLabel>old password</UserInformationInputLabel>
        <UserInformationInputWrapper>
          <UserInformationInput
            type="password"
            name="oldPassword"
            required
            minlength="1"
            maxlength="20"
            onBlur={onOldPasswordBlurHandler}
            onClick={onOldPasswordClickHandler}
          />
          {isWrongOldPassword && !isOldPasswordClicked ? (
            <BulletLayout description={oldPasswordDescription} />
          ) : (
            <SpaceBetween />
          )}
        </UserInformationInputWrapper>
      </UserInformationInputSectionWrapper>
      <UserInformationInputSectionWrapper marginTop={5}>
        <UserInformationInputLabel>new password</UserInformationInputLabel>
        <UserInformationInputWrapper>
          <UserInformationInput
            type="password"
            name="newPassword"
            required
            minlength="1"
            maxlength="20"
            onBlur={onNewPasswordBlurHandler}
            onClick={onNewPasswordClickHandler}
          />
          {isWrongNewPassword && !isNewPasswordClicked ? (
            <BulletLayout description={newPasswordDescription} />
          ) : (
            <SpaceBetween />
          )}
        </UserInformationInputWrapper>
      </UserInformationInputSectionWrapper>
      <UserInformationInputSectionWrapper marginTop={5}>
        <UserInformationInputLabel>new password confirm</UserInformationInputLabel>
        <UserInformationInputWrapper>
          <UserInformationInput
            type="password"
            name="newPasswordConfirm"
            required
            minlength="1"
            maxlength="20"
            onBlur={onNewPasswordBlurHandlerConfirm}
            onClick={onNewPasswordClickHandlerConfirm}
          />
          {isWrongNewPasswordConfirm && !isNewPasswordClickedConfirm ? (
            <BulletLayout description={newPasswordDescriptionConfirm} />
          ) : (
            <SpaceBetween />
          )}
        </UserInformationInputWrapper>
      </UserInformationInputSectionWrapper>
    </UserInformationWrapper>
  );
}

const UserInformationWrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 5px;
    border-radius: var(--border-radius);
    box-shadow: 1px 2px 3px 0 #949494;
    color: var(--main-background-font-color);
    overflow: hidden;
  `}
`;

const UserInformationTitleWrapper = styled.div`
  ${({ theme }) => css`
    padding: 10px;
    width: 100%;
    background: var(--green-background);
    color: var(--main-background-font-color);
  `}
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
  max-width: 67px;
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
