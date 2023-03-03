import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { userDataAction } from "@/lib/store/userData.slice";
import { userService } from "@/pages/services/authorization";

export default function LogoutSection() {
  const router = useRouter();
  const dispatch = useDispatch();

  // TODO: change to logout api
  const onClickLogoutHandler = async (e) => {
    e.preventDefault();
    dispatch(userDataAction.clear());
    localStorage.removeItem("token");
    userService.deleteJwtToken();
    router.push("/");
  };

  return (
    <LogoutSectionWrapper>
      <LogoutButton onClick={onClickLogoutHandler}>logout</LogoutButton>
    </LogoutSectionWrapper>
  );
}

const LogoutSectionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  border-top: 1px solid gray;
`;

const LogoutButton = styled.div`
  padding: 20px 10px 10px 10px;
  color: gray;
`;
