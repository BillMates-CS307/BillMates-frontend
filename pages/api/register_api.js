export default async function handler(req, res) {
    // Get data submitted in request's body.
    const req_body = JSON.parse(req.body);
    console.log(req_body);
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!req_body.email || !req_body.password) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'email or password not found' })
    }
  
    // Found the name.
    // Sends a HTTP success code

    //make request to Lambda
    const body_json = {fname : req_body.fname, lname : req_body.lname, email : req_body.email, password : req_body.password};
    const url = 'https://rdsn74oehsmrcoc2spf6aiw4iy0hqcbv.lambda-url.us-east-2.on.aws/';
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