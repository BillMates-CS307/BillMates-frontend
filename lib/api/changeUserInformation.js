export default async function changeUserInformation(body) {
  // TODO: Change data ONLY contains email and notification
  const data = {
    email: "lee2058@purdue.edu",
    name: "asdf",
    oldPassword: "QWErty123!",
    newPassword: "QWErty123!",
  };
  const JSONdata = JSON.stringify(data);
  const endpoint = "/api/change_user_information_api";
  // console.log(JSONdata);
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

  const result = await response.json();
  return result;
}
