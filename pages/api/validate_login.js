import jwt from 'jsonwebtoken';
import { serverRuntimeConfig } from '@/next.config';

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

  // Get data submitted in request's body.
  const { email, password, createJWT } = JSON.parse(req.body);

  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (!email || !password) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: 'email or password not found' })
  }

  // Found the name.
  // Sends a HTTP success code

  //make request to Lambda
  const url = 'https://jwfjuifdunib5gmornhrs4nm4a0pitnm.lambda-url.us-east-2.on.aws/';
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
    success: false
  }

  return await fetch(url, options).then((response) => {
    if (response.status == 500) {
      response_body.errorType = 500;
      return response_body;
    }
    return response.json();
  }).then((result) => {
    if (result.errorType != 500 && result.token_success && result.login_success && createJWT) {
      result["token"] = jwt.sign({ email: email }, serverRuntimeConfig.JWT_TOKEN, { expiresIn: '7d' });
      //result["token_l"] = jwt.sign({ email: email}, serverRuntimeConfig.JWT_TOKEN, { expiresIn: '1d' });
    }
    return res.status(200).json(result);
  }).catch((error) => { console.log(error); return res.status(500).json({ errorMessage: 'Internal API error' }) })

}