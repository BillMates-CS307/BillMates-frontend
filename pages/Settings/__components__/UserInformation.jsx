import React from "react";
import { useState } from "react";
import styled from "@emotion/styled";

export default function UserInformation() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  return (
    <UserInformationWrapper>
      <UserInformationTitleWrapper>
        <UserInformationTitle>User Information</UserInformationTitle>
      </UserInformationTitleWrapper>

      <UserInformationInputWrapper>
        <UserInformationInputLabel>name</UserInformationInputLabel>
        <UserInformationInput
          type="text"
          name="name"
          required
          minlength="1"
          maxlength="20"
        />
      </UserInformationInputWrapper>
      <UserInformationInputWrapper>
        <UserInformationInputLabel>password</UserInformationInputLabel>
        <UserInformationInput
          type="text"
          name="password"
          required
          minlength="1"
          maxlength="20"
        />
      </UserInformationInputWrapper>
    </UserInformationWrapper>
  );
}

const UserInformationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
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

const UserInformationInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 10px 0 10px;
  width: 100%;
`;

const UserInformationInputLabel = styled.div``;

const UserInformationInput = styled.input`
  height: 1.5rem;
  margin-left: 10px;
  padding: 3px 5px;
  padding-right: 1.5rem;
  width: 100%;
  max-width: 314px;
  border-radius: 5px;
  border: 1px solid #9e9e9e;

  :focus {
    outline: 1px solid #00c923;
  }

  :active {
    border: 1px solid #ff0101;
  }
`;
