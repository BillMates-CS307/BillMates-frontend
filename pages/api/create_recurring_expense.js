import { serverRuntimeConfig } from '@/next.config';
import { printLogHeading } from '../global_components/logging';

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

  // Get data submitted in request's body.
  const { title, group_id, expense, total, owner, comment, start_date, start_time, frequency, tag } = JSON.parse(req.body);
  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (title == null || group_id == null || expense == null || total == null || owner == null || comment == null
    || start_time == null || start_date == null || frequency == null || tag == null) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ message: 'email or password not found' })
  }

  // Found the name.
  // Sends a HTTP success code

  //make request to Lambda
  const url = 'https://c6z6xbilcykvustu5h3jpdy3ty0znsge.lambda-url.us-east-2.on.aws/';
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
    printLogHeading("CREATE_RECURRING_EXPENSE", response.status);
    // console.log(response);
    if (response.status != 200) {
      return response;
    }
    return response.json();
  }).then((result) => {
    console.log(result);
    if (result.status) { //non-200 response from lambda
        return res.status(result.status).json();
    }
    return res.status(200).json(result);
  }).catch((error) => {
    printLogHeading("CREATE_RECURRING_EXPENSE", 500);
    console.log(error); 
    return res.status(500).json(); 
  });

}