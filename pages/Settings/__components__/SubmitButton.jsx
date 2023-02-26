import React from "react";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { selectsettingsData } from "@/lib/store/settingsData.slice";

export default function SubmitButton() {
  const { name, password, notiPref } = useSelector(selectsettingsData);
  const onClickSubmitHandler = async (e) => {
    e.preventDefault();
    // Get data from the form.
    const data = {
      name,
      password,
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
    <SubmitButtonWrapper onClick={onClickSubmitHandler}>
      Submit
    </SubmitButtonWrapper>
  );
}

const SubmitButtonWrapper = styled.div`
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 1px 2px 3px 0 #949494;
  background: #00c923;
  color: white;
  font-weight: bold;
`;
