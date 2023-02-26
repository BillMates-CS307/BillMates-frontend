import jwt from 'jsonwebtoken';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export default async function handler(req, res) {

  if (req.method !== "POST")  {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

    // Get data submitted in request's body.
    const {email, password} = JSON.parse(req.body);
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!email || !password) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'email or password not found' })
    }
  
    // Found the name.
    // Sends a HTTP success code

    //make request to Lambda
    const body_json = {email : email, password : password};
    const url = 'https://jwfjuifdunib5gmornhrs4nm4a0pitnm.lambda-url.us-east-2.on.aws/';
    const options = {
      method: 'POST',
      mode : 'cors',
      headers: {
        'Content-Type': 'application/json',
        'token' : 'zpdkwA.2_kLU@zg'
      },
      body: JSON.stringify(body_json),
    }

    const lambda_resp = await fetch(url, options);
    const lambda_data = await lambda_resp.json();
    if (lambda_data.token_success && lambda_data.login_success) {
      lambda_data["token"] = jwt.sign({ sub: email}, serverRuntimeConfig.JWT_TOKEN, { expiresIn: '7d' });
    }

    return res.status(200).json(lambda_data);

  }