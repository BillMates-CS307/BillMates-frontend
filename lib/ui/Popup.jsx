import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Portal } from "./Portal";
import {
  opacityAnimation,
  EaseInCubic,
  EaseOutCubic,
} from "./transitionOptions";
import { TransitionAnimate } from "./TransitionAnimate";
import { popupAction, selectPopupIsEndEvent } from "../store/popup/popup.slice";

export const Popup = ({ isVisible = false, zIndex = 30, ...props }) => {
  const dispatch = useDispatch();
  const isEndEvent = useSelector(selectPopupIsEndEvent);
  const onWrapperClickHandler = () => {
    dispatch(popupAction.onClick());
  };

  useEffect(() => {
    if (isEndEvent) {
      return;
    }

    const timer = setTimeout(() => {
      if (isVisible) {
        dispatch(popupAction.timeout());
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, isEndEvent, dispatch]);

  return (
    <Portal>
      <TransitionAnimate
        active={isVisible}
        with={opacityAnimation({
          duration: 200,
          maxOpacity: 0.95,
          initialStyle: {
            width: "100%",
            position: "fixed",
            left: 0,
            top: 0,
            zIndex,
          },
          enterEasing: EaseOutCubic,
          leaveEasing: EaseInCubic,
        })}
      >
        <Dim isEndEvent={isEndEvent} />
      </TransitionAnimate>
      <TransitionAnimate
        active={isVisible}
        with={opacityAnimation({
          duration: 200,
          maxOpacity: 1,
          initialStyle: {
            width: "100%",
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: zIndex + 1,
          },
          enterEasing: EaseOutCubic,
          leaveEasing: EaseInCubic,
        })}
      >
        <Wrapper onClick={onWrapperClickHandler}>{props.children}</Wrapper>
      </TransitionAnimate>
    </Portal>
  );
};

const Dim = styled.div`
  ${({ isEndEvent }) => css`
    height: ${isEndEvent ? "100vh" : "545px"};
    background: ${isEndEvent
      ? "rgba(22, 27, 46, 0.8)"
      : "linear-gradient(180deg, rgba(22, 27, 46, 0.98) 40%, rgba(22, 27, 46, 0) 100%)"};
    touch-action: none;
  `}
`;

const Wrapper = styled.div`
  ${({ isEndEvent }) => css`
    display: flex;
    justify-content: ${isEndEvent ? "center" : "start"};
    align-items: center;
    width: 100vw;
    height: 50vh;
    padding: 0 40px;
    touch-action: none;
  `}
`;
