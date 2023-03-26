import { serverRuntimeConfig } from "@/next.config";

export default async function handler(req, res) {
  // Get data submitted in request's body.
  const req_body = JSON.parse(req.body);
  // console.log(req);
  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (!req_body.email || !req_body.notification) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "notification not found" });
  }

  // Found the name.
  // Sends a HTTP success code

  //make request to Lambda
  const body_json = { ...req_body };
  const url =
    "https://yimbhwmzyzeikdbjqylkdonwoy0czhwq.lambda-url.us-east-2.on.aws/";
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: serverRuntimeConfig.LAMBDA_TOKEN,
    },
    body: JSON.stringify(body_json),
  };

  let response_body = {
    errorType: 0,
    success: false,
  };

  return await fetch(url, options)
    .then((response) => {
      if (response.status == 500) {
        response_body.errorType = 500;
        return response_body;
      }
      return response.json();
    })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ message: "Internal API error" });
    });
}
