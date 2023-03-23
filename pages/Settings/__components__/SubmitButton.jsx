import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useTheme } from "next-themes";
import { THEME } from "@/lib/constants";
import { useSelector } from "react-redux";
import { selectUserData } from "@/lib/store/userData.slice";

export default function SubmitButton() {
  const { theme, setTheme } = useTheme();
  const {
    email,
    name,
    oldPassword,
    newPassword,
    settings: { notification },
  } = useSelector(selectUserData);
  const onClickSubmitHandler = async (e) => {
    e.preventDefault();
    const data = {
      email,
      name,
      oldPassword,
      newPassword,
      notification,
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/settings_api";
    // console.log(JSONdata);
    // Form the request for sending data to the server.
    const options = {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };
    const response = await fetch(endpoint, options);

    if (response.status == 400) {
      alert("Failed ");
      return;
    }

    const result = await response.json();
    console.log(result);
  };

  return (
    <SubmitButtonWrapper theme={theme} onClick={onClickSubmitHandler}>
      Submit
    </SubmitButtonWrapper>
  );
}

const SubmitButtonWrapper = styled.div`
  ${({ theme }) => css`
    text-align: center;
    margin-top: 10px;
    padding: 10px;
    width: 100%;
    border-radius: 10px;
    box-shadow: 1px 2px 3px 0 #949494;
    background: #00c923;
    color: ${theme === THEME.LIGHT ? "white" : "black"};
    font-weight: bold;
  `}
`;
