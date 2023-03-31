import { isNil } from "lodash";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

  // Get data submitted in request's body.
  const { secret, deviceId } = JSON.parse(req.body);
  // console.log("api");
  // console.log(secret);
  // console.log(deviceId);
  // Found the name.
  // Sends a HTTP success code
  const body = JSON.stringify({ via: "sms" });
  // console.log(body);
  // const body = JSON.stringify({ via: "sms" });
  //make request to Venmo
  const url = "https://api.venmo.com/v1/account/two-factor/token";
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "venmo-otp": "required; two_factor",
      "venmo-otp-secret": secret,
      "device-id": deviceId,
    },
    body,
  };

  const lambda_resp = await fetch(url, options);
  console.log(lambda_resp);
  const lambda_data = await lambda_resp.json();
  console.log(lambda_data.error);
  if (!isNil(lambda_data.error)) {
    res.status(400);
  }
  return res.json(lambda_data);
}
