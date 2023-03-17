import jwt from 'jsonwebtoken';
import { serverRuntimeConfig } from '@/next.config';

export default async function handler(req, res) {

  if (req.method !== "POST")  {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

    // Get data submitted in request's body.
    const {email, password, device_id} = JSON.parse(req.body);
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!email || !password || !device_id) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'email or password or device id not found' })
    }
  
    // Found the name.
    // Sends a HTTP success code
    const body = JSON.stringify({
        "phone_email_or_username": email,
        "client_id": "1",
        "password": password
      });
    //make request to Venmo
    const url = 'https://api.venmo.com/v1/oauth/access_token';
    const options = {
      method: 'POST',
      mode : 'cors',
      headers: {
        'Content-Type': 'application/json',
        'device-id' : device_id
      },
      body: body,
    }

    let response_body = {
        errorType : 0,
        success : false
    }

    return await fetch(url, options).then( (response) => {
        let venmoResponse = {
            error : false,
            validLogin : false,
            otpSecret : null,
            deviceId : null
        }
        if (response.status == 200) {
            venmoResponse.validLogin = true;
            return venmoResponse;
        }
        if (response.status == 400) { //invalid login
            return venmoResponse;
        }
        if (response.status == 401) { //requires 2-factor
            venmoResponse.validLogin = true;
            venmoResponse.otpSecret = response.headers.get('venmo-otp-secret');
            venmoResponse.deviceId = device_id;
            return venmoResponse;
        }
        if (response.status == 500) {
            venmoResponse.error = true;
            venmoResponse["errorType"] = 500;
            venmoResponse["errorMessage"] = "Error from Venmo";
            return venmoResponse;
        }
        //return response.json();
    }).then( (result) => {
        //check is invalid, 2-factor, or just successful

        // if (result.errorType != 500 && result.token_success && result.login_success && createJWT) {
        //     result["token_c"] = jwt.sign({ email: email}, serverRuntimeConfig.JWT_TOKEN, { expiresIn: '7d' });
        //     result["token_l"] = jwt.sign({ email: email}, serverRuntimeConfig.JWT_TOKEN, { expiresIn: '1d' });
        // }
        return res.status(200).json(result);
    }).catch( (error) => {console.log(error); return res.status(500).json({ errorMessage: 'Internal API error' })} )

  }