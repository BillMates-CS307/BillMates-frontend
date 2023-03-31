import { serverRuntimeConfig } from '@/next.config';

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

  // Get data submitted in request's body.
  const { title, group_id, expense, total, owner, comment } = JSON.parse(req.body);
  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (title == null || group_id == null || expense == null || total == null || owner == null || comment == null) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ message: 'email or password not found' })
  }

  // Found the name.
  // Sends a HTTP success code

  //make request to Lambda
  const url = 'https://osggc3wtegomn5yliv5heqkpji0ohbfk.lambda-url.us-east-2.on.aws/';
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
    console.log("======================CREATE_EXPENSE_RESPONSE======================");
    console.log(response);
    if (response.status == 500) {
      response_body.errorType = 500;
      return response_body;
    }
    return response.json();
  }).then((result) => {
    return res.status(200).json(result);
  }).catch((error) => { console.log(error); return res.status(500).json({ message: 'Internal API error' }) })

}