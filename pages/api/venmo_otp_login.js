export default async function handler(req, res) {

  if (req.method !== "POST")  {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

    // Get data submitted in request's body.
    const {secret, device_id, otp_code} = JSON.parse(req.body);
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!secret || !otp_code || !device_id) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'email or password or device id not found' })
    }
  
    // Found the name.
    // Sends a HTTP success code
    // const body = JSON.stringify({
    //     "phone_email_or_username": email,
    //     "client_id": "1",
    //     "password": password
    //   });
    //make request to Venmo
    const url = 'https://api.venmo.com/v1/oauth/access_token';
    const options = {
      method: 'POST',
      mode : 'cors',
      headers: {
        'Content-Type': 'application/json',
        'device-id' : device_id,
        'venmo-otp-secret' : secret,
        'Venmo-Otp' : otp_code
      },
      body: "",
    }

    let response_body = {
        errorType : 0,
        success : true
    }

    return await fetch(url, options).then( (response) => {

        if (response.status == 400) { //code expired
            return response_body;
        }
        return response.json();
    }).then( (result) => {
        if (result.success) { //counter-intuitive
            result.success = false;
            return res.status(200).json(result);
        }
        result["success"] = true;
        return res.status(200).json(result);
    }).catch( (error) => {console.log(error); return res.status(500).json({ errorMessage: 'Internal API error' })} )

  }