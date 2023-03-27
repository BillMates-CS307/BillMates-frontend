import { isNil } from "lodash";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

  // Get data submitted in request's body.
  const { email, password, device_id } = JSON.parse(req.body);
  // Found the name.
  // Sends a HTTP success code
  const body = JSON.stringify({
    phone_email_or_username: email,
    client_id: "1",
    password: password,
  });

  //make request to Venmo
  const url = "https://api.venmo.com/v1/oauth/access_token";
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "device-id": device_id,
    },
    body,
  };

  const lambda_resp = await fetch(url, options);
  console.log(lambda_resp.headers);
  const lambda_data = await lambda_resp.json();

  if (!isNil(lambda_resp.headers["venmo-otp-secret"])) {
    lambda_data["venmo-otp-secret"] = lambda_resp.headers["venmo-otp-secret"];
  }

  return res.json(lambda_data);
}
