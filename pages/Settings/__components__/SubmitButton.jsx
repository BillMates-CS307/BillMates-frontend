import React from "react";

import styled from "@emotion/styled";

export default function SubmitButton() {
  return <SubmitButtonWrapper>Submit</SubmitButtonWrapper>;
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

const SubmitButtonWrapper = styled.div`
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 1px 2px 3px 0 #949494;
  background: #00c923;
  color: white;
  font-weight: bold;
`;
