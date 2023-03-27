import React from "react";
import styled from "@emotion/styled";
import { useDispatch } from "react-redux";
import { userDataAction } from "@/lib/store/userData/userData.slice";
import Header from "@/pages/global_components/header";
import Footer from "@/pages/global_components/footer";
import CustomHead from "@/pages/global_components/head";
import SubmitButton from "../__components__/SubmitButton";
import { CommonPopup } from "@/lib/ui/CommonPopup";
import VenmoContents from "../__components__/VenmoContents";

export default function Venmo() {
  const dispatch = useDispatch();
  const onClickLinkHandler = async (e) => {
    e.preventDefault();
    dispatch(userDataAction.requestFlowLinkVenmo());
  };

  return (
    <>
      <CustomHead
        title={"Venmo"}
        description={"Place to link venmo account to your BillMate preferences"}
      ></CustomHead>
      <CommonPopup />
      <Header />
      <VenmoWrapper>
        <VenmoContents />
        <SubmitButton
          text="Link Venmo"
          onClickSubmitHandler={onClickLinkHandler}
        />
        <Space />
      </VenmoWrapper>
      <Footer />
    </>
  );
}

const VenmoWrapper = styled.div`
  max-width: 700px;
  width: 90%;
  margin: 0 auto;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: 1px 2px 15px 0 #949494;
  color: var(--main-background-font-color);
  background: var(--main-background);
`;

const Space = styled.div`
  width: 100%;
  height: 50px;
`;
