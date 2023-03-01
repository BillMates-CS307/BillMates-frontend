export default async function handler(req, res) {

    if (req.method !== "POST")  {
      return res.status(405).end(`Method : ${req.method} not allowed`);
    }
  
      // Get data submitted in request's body.
      const {groupname} = JSON.parse(req.body);
    
      // Guard clause checks for first and last name,
      // and returns early if they are not found
    //   if (!isAccepted || !amountPaying || !expense) {
    //     // Sends a HTTP bad request error code
    //     return res.status(400).json({ data: 'acceptance, amount, or expense not found' })
    //   }
    
      // Found the name.
      // Sends a HTTP success code
  
      //make request to Lambda
      const body_json = {name : groupname};
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
      // if (lambda_data.token_success && lambda_data.data_sucess) {
      //   //lambda_data["token"] = jwt.sign({ email: email}, serverRuntimeConfig.JWT_TOKEN, { expiresIn: '7d' });
      // }
  
      return res.status(200).json(lambda_data);
  
    }