import { isNil } from "lodash";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

  // Get data submitted in request's body.
  const { secret, device_id, otp_code } = JSON.parse(req.body);

  // Guard clause checks for first and last name,
  // and returns early if they are not found
  // if (!secret || !otp_code || !device_id) {
  //   // Sends a HTTP bad request error code
  //   return res
  //     .status(400)
  //     .json({ data: "email or password or device id not found" });
  // }

  // Found the name.
  // Sends a HTTP success code
  const body = JSON.stringify({});
  //make request to Venmo
  const url = "https://api.venmo.com/v1/oauth/access_token?client_id=1";
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "device-id": device_id,
      "venmo-otp-secret": secret,
      "Venmo-Otp": otp_code,
    },
    body,
  };

  const lambda_resp = await fetch(url, options);
  // console.log(lambda_resp);
  const lambda_data = await lambda_resp.json();
  // console.log(lambda_data.error);
  if (!isNil(lambda_data.error)) {
    res.status(400);
  }

  return res.json(lambda_data);
}
