import React from "react";
import styled from "@emotion/styled";

export default function SubmitButton({ text, onClickSubmitHandler }) {
  return (
    <SubmitButtonWrapper onClick={onClickSubmitHandler}>
      {text}
    </SubmitButtonWrapper>
  );
}

const SubmitButtonWrapper = styled.div`
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  border-radius: var(--border-radius);
  box-shadow: 1px 2px 3px 0 #949494;
  background: #00c923;
  color: var(--main-background-font-color);
  font-weight: bold;
`;
