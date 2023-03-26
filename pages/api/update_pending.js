import { serverRuntimeConfig } from '@/next.config';

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

  // Get data submitted in request's body.
  const { accepted, payment_id } = JSON.parse(req.body);

  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (accepted == null || payment_id == null) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ message: 'email or password not found' })
  }

  // Found the name.
  // Sends a HTTP success code

  //make request to Lambda
  const url = 'https://jfynig6bitelqawn2z4pv7rg440wnwjw.lambda-url.us-east-2.on.aws/';
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
    return res.status(200).json(result);
  }).catch((error) => { console.log(error); return res.status(500).json({ message: 'Internal API error' }) })

}