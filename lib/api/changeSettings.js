export default async function changeSettings(body) {
  // TODO: Change data ONLY contains email and notification
  const data = {
    email: "lee2058@purdue.edu",
    name: "asdf",
    oldPassword: "QWErty123!",
    newPassword: "QWErty123!",
    notification: body.notification,
  };
  const JSONdata = JSON.stringify(data);
  const endpoint = "/api/settings_api";
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
