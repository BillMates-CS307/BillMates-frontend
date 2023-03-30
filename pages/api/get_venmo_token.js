import { serverRuntimeConfig } from '@/next.config';

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
    return res.status(400).json({ message: 'email or password not found' })
  }

  // Found the name.
  // Sends a HTTP success code

  //make request to Lambda
  const url = 'https://qol6mrbwipmg6r6ksaili6rbx40kpmhk.lambda-url.us-east-2.on.aws/';
  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'token': serverRuntimeConfig.LAMBDA_TOKEN
    },
    body: req.body,
  }

  let response_body = {
    errorType: 0,
    errorMessage : "",
    success: false
  }

  return await fetch(url, options).then((response) => {
    console.log("\x1b[32m======================GET_VENMO_TOKEN_RESPONSE======================\x1b[0m");
    console.log(response);
    if (response.status != 200) {
      response_body.errorType = response.status;
      response_body.errorMessage = "Received a " + response.status + " from the server";
      return response_body;
    }
    return response.json();
  }).then((result) => {
    console.log("\x1b[32m======================GET_VENMO_TOKEN_RESULT======================\x1b[0m");
    console.log(result);
    if (!('errorType' in result)) {
        result["errorType"] = 0;
        result["errorMessage"] = "";
        result["success"] = true;
    }
    return res.status(200).json(result);
  }).catch((error) => { console.log(error); return res.status(500).json({ message: 'Internal API error' }) })

}