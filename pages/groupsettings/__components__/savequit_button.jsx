import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useTheme } from "next-themes";
import { THEME } from "@/lib/constants";
import { useSelector } from "react-redux";
import { selectGroupData } from "@/lib/store/groupData.slice";

export default function SaveQuitButton({saveData}) {
  return (
    <SubmitButtonWrapper onClick={saveData}>
      Save Settings
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
    background: var(--green-background);
    color: var(--main-background-font-color);
    font-weight: bold;
`;
