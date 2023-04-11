import { serverRuntimeConfig } from "@/next.config";

export default async function handler(req, res) {
  // Get data submitted in request's body.
  const req_body = JSON.parse(req.body);
  // console.log(req_body);
  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (!req_body.email || !req_body.group_id) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: "Check the request body" });
  }

  // Found the name.
  // Sends a HTTP success code

  //make request to Lambda
  const body_json = { ...req_body };
  const url =
    "https://insa5ebljuef64fgncauekqrgq0lerzj.lambda-url.us-east-2.on.aws/";
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

  const lambda_resp = await fetch(url, options);
  const lambda_data = await lambda_resp.json();

  return res.json(lambda_data);
}
