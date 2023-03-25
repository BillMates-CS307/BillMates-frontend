export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

  // Get data submitted in request's body.
  const { secret, device_id } = JSON.parse(req.body);

  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (!secret || !device_id) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: 'secret or device id not found' })
  }

  // Found the name.
  // Sends a HTTP success code
  const body = JSON.stringify({
    "via": "sms"
  });
  //make request to Venmo
  const url = 'https://api.venmo.com/v1/account/two-factor/token';
  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'device-id': device_id,
      'venmo-otp-secret': secret
    },
    body: body,
  }

  let response_body = {
    errorType: 0,
    success: false
  }

  return await fetch(url, options).then((response) => {
    if (response.status == 200) {
      response_body.success = true;
      return response_body;
    }
    if (response.status == 400) { //otp expired
      return response_body;
    }
    if (response.status == 500) {
      response_body.errorType = 500;
      return response_body;
    }
    return response.json();
  }).then((result) => {
    console.log(result);
    //check is invalid, 2-factor, or just successful

    // if (result.errorType != 500 && result.token_success && result.login_success && createJWT) {
    //     result["token_c"] = jwt.sign({ email: email}, serverRuntimeConfig.JWT_TOKEN, { expiresIn: '7d' });
    //     result["token_l"] = jwt.sign({ email: email}, serverRuntimeConfig.JWT_TOKEN, { expiresIn: '1d' });
    // }
    return res.status(200).json(result);
  }).catch((error) => { console.log(error); return res.status(500).json({ errorMessage: 'Internal API error' }) })

}