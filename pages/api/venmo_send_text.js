export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

  // Get data submitted in request's body.
  const { secret, error } = JSON.parse(req.body);

  // Found the name.
  // Sends a HTTP success code
  const body = JSON.stringify({
    error,
  });
  //make request to Venmo
  const url = "https://api.venmo.com/v1/account/two-factor/token";
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "venmo-otp": "required; two_factor",
      "venmo-otp-secret": secret,
    },
    body: body,
  };

  const lambda_resp = await fetch(url, options);
  const lambda_data = await lambda_resp.json();
  return res.json(lambda_data);
}
