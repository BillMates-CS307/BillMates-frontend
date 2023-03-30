import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useTheme } from "next-themes";
import { THEME } from "@/lib/constants";
import { useSelector } from "react-redux";
import { selectGroupData } from "@/lib/store/groupData.slice";

export default function SaveQuitButton() {
  const { theme, setTheme } = useTheme();
  const {
    groupId,
    name,
    members,
    expenses,
    pending,
    balance,
    manager,
    maxComment,
  } = useSelector(selectGroupData);
  const onClickSubmitHandler = async (e) => {
    e.preventDefault();
    const data = {
        groupId,
        name,
        members,
        expenses,
        pending,
        balance,
        manager,
        maxComment,
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/get_group_data";
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
      Save Settings
    </SubmitButtonWrapper>
  );
}

const SubmitButtonWrapper = styled.div`
  ${({ theme }) => css`
    text-align: center;
    margin-top: 10px;
    padding: 10px;
    width: 100%;
    border-radius: var(--border-radius);
    box-shadow: 1px 2px 3px 0 #949494;
    background: #00c923;
    color: var(--main-background-font-color);
    font-weight: bold;
  `}
`;
