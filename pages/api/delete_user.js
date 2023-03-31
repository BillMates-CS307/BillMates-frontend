import { serverRuntimeConfig } from "@/next.config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

  // Get data submitted in request's body.
  const { email } = JSON.parse(req.body);

  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (email == null) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ message: "email or password not found" });
  }

  // Found the name.
  // Sends a HTTP success code

  //make request to Lambda
  const url =
    "https://s4m26xzazywekzmwbz2jsoikhq0tcfth.lambda-url.us-east-2.on.aws/";
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: serverRuntimeConfig.LAMBDA_TOKEN,
    },
    body: req.body,
  };

  const lambda_resp = await fetch(url, options);
  const lambda_data = await lambda_resp.json();

  return res.json(lambda_data);
}
