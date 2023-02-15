export default function handler(req, res) {
    // Get data submitted in request's body.
    const body = req.body
    console.log(req);
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log('body: ', body)
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.email || !body.password) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'email or password not found' })
    }
  
    // Found the name.
    // Sends a HTTP success code

    //make request to Lambda
    const lambda_resp = 'true';

    return res.status(200).json(lambda_resp)

  }