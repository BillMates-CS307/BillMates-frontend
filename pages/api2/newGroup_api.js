import { serverRuntimeConfig } from '@/next.config';

export default async function handler(req, res) {
    const req_body = JSON.parse(req.body);
    console.log(req_body);
    
    // if (req.method !== "POST") 
    if (!req_body.groupname || !req_body.manager) {
      return res.status(400).json({ data: 'groupname or manager not found' })
    }

    //make request to Lambda
    const body_json = {name : req_body.groupname, manager : req_body.manager};
    const url = 'https://wwr7yimislgmw7f5crxlnqmxxq0prart.lambda-url.us-east-2.on.aws/';
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
      console.log(lambda_data);
      return res.status(200).json(lambda_data);
  
    }