import isUndefined from "lodash/isUndefined";
import React from "react";
import { useSelector } from "react-redux";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { selectPopup } from "../store/popup/popup.slice";
import { Popup } from "./Popup";

export const CommonPopup = () => {
  const { isEndEvent, isVisible, mainTexts, subTexts } =
    useSelector(selectPopup);

  return (
    <Popup isVisible={isVisible}>
      <PopupLayout isEndEvent={isEndEvent}>
        <TextLayout>
          {/* {mainTexts?.map((mainText, i) => ( */}
          <MainText>{mainTexts}</MainText>
          {/* ))} */}
        </TextLayout>
        <TextLayout paddingTop={16}>
          {/* {subTexts?.map((subText, i) => ( */}
          <SubText>{subTexts}</SubText>
          {/* ))} */}
        </TextLayout>
      </PopupLayout>
    </Popup>
  );
};

const PopupLayout = styled.div`
  ${({ isEndEvent }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: ${isEndEvent ? 0 : 80}px;
    width: 100%;
    background: transparent;
  `}
`;

const TextLayout = styled.div`
  ${({ paddingTop }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: ${!isUndefined(paddingTop) ? paddingTop : 0}px;
    width: 100%;
  `}
`;

const MainText = styled.div`
  color: #f5f6f7;
  font-size: 26px;
  line-height: 42px;
  font-weight: bold;
`;

const SubText = styled.div`
  color: white;
  font-size: 14px;
  line-height: 25px;
  font-weight: normal;
`;
