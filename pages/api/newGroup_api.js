import { serverRuntimeConfig } from '@/next.config';

export default async function handler(req, res) {
    const req_body = JSON.parse(req.body);
    console.log(req_body);
    
    // if (req.method !== "POST") 
    if (!req_body.groupname || !req_body.name) {
      return res.status(400).json({ data: 'groupname or manager not found' })
    }

    //make request to Lambda
    const body_json = {groupname : req_body.groupname, manager : req_body.name};
    const url = 'https://cxt3kig2ocrigm3mvzm7ql3m6u0plfwd.lambda-url.us-east-2.on.aws/';
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

      return res.status(200).json(lambda_data);
  
    }