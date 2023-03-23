import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useTheme } from "next-themes";
import { THEME } from "@/lib/constants";

export default function Theme() {
  const { theme, setTheme } = useTheme();

  const onThemeChangeHandler = (e) => {
    switch (e.target.value) {
      case THEME.DARK:
        setTheme(THEME.DARK);
        break;
      case THEME.LIGHT:
        setTheme(THEME.LIGHT);
        break;
    }
  };

  return (
    <ThemeWrapper theme={theme}>
      <ThemeTitleWrapper theme={theme}>
        <ThemeTitle>Theme</ThemeTitle>
      </ThemeTitleWrapper>
      <ThemeRadioButtonWrapper>
        <ThemeRadioButton
          type="radio"
          name="theme"
          value={THEME.LIGHT}
          checked={theme === THEME.LIGHT}
          onChange={onThemeChangeHandler}
        />
        <ThemeButtonLabel>Light</ThemeButtonLabel>
      </ThemeRadioButtonWrapper>
      <ThemeRadioButtonWrapper>
        <ThemeRadioButton
          type="radio"
          name="theme"
          value={THEME.DARK}
          checked={theme === THEME.DARK}
          onChange={onThemeChangeHandler}
        />
        <ThemeButtonLabel>Dark</ThemeButtonLabel>
      </ThemeRadioButtonWrapper>
    </ThemeWrapper>
  );
}

const ThemeWrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding-bottom: 10px;
    border-radius: var(--border-radius);
    box-shadow: 1px 2px 3px 0 #949494;
    color: var(--main-background-font-color);
    overflow: hidden;
  `}
`;

const ThemeTitleWrapper = styled.div`
  ${({ theme }) => css`
    padding: 10px;
    width: 100%;
    background: var(--green-background);
    color: var(--main-background-font-color);
  `}
`;

const ThemeTitle = styled.h3``;

const ThemeRadioButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  padding: 0 10px 0 10px;
  width: 100%;
`;

const ThemeButtonLabel = styled.div`
  margin-left: 10px;
`;

const ThemeRadioButton = styled.input`
  font-size: 15px;
  line-height: 26px;
  font-weight: bold;
`;
