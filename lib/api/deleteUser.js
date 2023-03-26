export default async function deleteUser(body) {
  // TODO: Change data ONLY contains email and notification
  const data = {
    email: "lee2058@purdue.edu",
  };
  const JSONdata = JSON.stringify(data);
  const endpoint = "/api/delete_user_api";
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
