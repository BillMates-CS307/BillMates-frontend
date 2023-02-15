export default async function handler(req, res) {
    // Get data submitted in request's body.
    const body = req.body
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.email || !body.password) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'email or password not found' })
    }
  
    // Found the name.
    // Sends a HTTP success code

    //make request to Lambda
    const url = 'https://jwfjuifdunib5gmornhrs4nm4a0pitnm.lambda-url.us-east-2.on.aws/';
    const options = {
      method: 'POST',
      mode : 'cors',
      headers: {
        'Content-Type': 'application/json',
        'token' : 'zpdkwA.2_kLU@zg'
      },
      body: {email : body.email, password : body.password},
    }

    const lambda_resp = await fetch(url, options);
    const lambda_data = await lambda_resp.json();

    return res.status(200).json(lambda_data);

  }