import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { PAYMENT_PREFERENCE } from "@/lib/constants";

export default function PaymentPreference() {
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
    <PaymentPreferenceWrapper>
      <PaymentPreferenceTitleWrapper>
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-bottom: 10px;
  border-radius: 10px;
  box-shadow: 1px 2px 3px 0 #949494;
  color: black;
  overflow: hidden;
`;

const PaymentPreferenceTitleWrapper = styled.div`
  padding: 10px;
  width: 100%;
  background: #00c923;
  color: white;
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
