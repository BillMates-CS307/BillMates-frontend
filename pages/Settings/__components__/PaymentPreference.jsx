import React from "react";
import { useState } from "react";
import styled from "@emotion/styled";

export default function PaymentPreference() {
  // TODO: should be saved on local storage
  const [paymentPref, setPaymentPref] = useState("cash");
  return (
    <PaymentPreferenceWrapper>
      <PaymentPreferenceTitleWrapper>
        <PaymentPreferenceTitle>Payment Preference</PaymentPreferenceTitle>
      </PaymentPreferenceTitleWrapper>
      <PaymentPreferenceRadioButtonWrapper>
        <PaymentPreferenceRadioButton
          type="radio"
          name="payment"
          value="venmo"
          onChange={(e) => setPaymentPref(e.target.value)}
        />
        <PaymentPreferenceButtonLabel>Venmo</PaymentPreferenceButtonLabel>
      </PaymentPreferenceRadioButtonWrapper>
      <PaymentPreferenceRadioButtonWrapper>
        <PaymentPreferenceRadioButton
          type="radio"
          name="payment"
          value="cash"
          onChange={(e) => setPaymentPref(e.target.value)}
        />
        <PaymentPreferenceButtonLabel>Cash</PaymentPreferenceButtonLabel>
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
