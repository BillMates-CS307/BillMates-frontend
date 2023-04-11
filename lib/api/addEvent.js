export default async function addEvent(body) {
  const JSONdata = JSON.stringify(body);
  const endpoint = "/api/add_event";
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
