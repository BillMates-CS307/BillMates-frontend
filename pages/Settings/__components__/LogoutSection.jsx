import React from "react";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { selectUserData } from "@/lib/store/userData.slice";

export default function LogoutSection() {
  const { name, changedPassword, notiPref } = useSelector(selectUserData);

  // TODO: change to logout api
  const onClickSubmitHandler = async (e) => {
    e.preventDefault();
    // TODO: should fix this later to connect with redux
    const email = "test@test.test";
    const data = {
      email,
      name,
      password: changedPassword,
      notiPref,
    };

    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/settings_api";

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
    <LogoutSectionWrapper>
      <LogoutButton onClick={onClickSubmitHandler}>logout</LogoutButton>
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
