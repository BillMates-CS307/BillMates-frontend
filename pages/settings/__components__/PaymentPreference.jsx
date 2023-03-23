import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useTheme } from "next-themes";
import { THEME, PAYMENT_PREFERENCE } from "@/lib/constants";

export default function PaymentPreference() {
  const { theme } = useTheme();
  const [paymentPref, setPaymentPref] = useState(null);

  useEffect(() => {
    setPaymentPref(
      JSON.parse(localStorage.getItem("payment_preference")) ??
        PAYMENT_PREFERENCE.CASH
    );
  }, [paymentPref]);

  const onPaymentPreferenceChangeHandler = (e) => {
    switch (e.target.value) {
      case PAYMENT_PREFERENCE.VENMO:
        localStorage.setItem(
          "payment_preference",
          JSON.stringify(e.target.value)
        );
        setPaymentPref(PAYMENT_PREFERENCE.VENMO);

        break;
      case PAYMENT_PREFERENCE.CASH:
        localStorage.setItem(
          "payment_preference",
          JSON.stringify(e.target.value)
        );
        setPaymentPref(PAYMENT_PREFERENCE.CASH);
        break;
    }
  };

  return (
    <PaymentPreferenceWrapper theme={theme}>
      <PaymentPreferenceTitleWrapper theme={theme}>
        <PaymentPreferenceTitle>Payment Preference</PaymentPreferenceTitle>
      </PaymentPreferenceTitleWrapper>
      <PaymentPreferenceRadioButtonWrapper>
        <PaymentPreferenceRadioButton
          type="radio"
          name="payment"
          value={PAYMENT_PREFERENCE.CASH}
          checked={paymentPref === PAYMENT_PREFERENCE.CASH}
          onChange={onPaymentPreferenceChangeHandler}
        />
        <PaymentPreferenceButtonLabel>Cash</PaymentPreferenceButtonLabel>
      </PaymentPreferenceRadioButtonWrapper>
      <PaymentPreferenceRadioButtonWrapper>
        <PaymentPreferenceRadioButton
          type="radio"
          name="payment"
          value={PAYMENT_PREFERENCE.VENMO}
          checked={paymentPref === PAYMENT_PREFERENCE.VENMO}
          onChange={onPaymentPreferenceChangeHandler}
        />
        <PaymentPreferenceButtonLabel>Venmo</PaymentPreferenceButtonLabel>
      </PaymentPreferenceRadioButtonWrapper>
    </PaymentPreferenceWrapper>
  );
}

const PaymentPreferenceWrapper = styled.div`
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

const PaymentPreferenceTitleWrapper = styled.div`
  ${({ theme }) => css`
    padding: 10px;
    width: 100%;
    background: var(--green-background);
    color: var(--main-background-font-color);
  `}
`;

const PaymentPreferenceTitle = styled.h3``;

const PaymentPreferenceRadioButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  padding: 0 10px 0 10px;
  width: 100%;
`;

const PaymentPreferenceButtonLabel = styled.div`
  margin-left: 10px;
`;

const PaymentPreferenceRadioButton = styled.input`
  font-size: 15px;
  line-height: 26px;
  font-weight: bold;
`;
