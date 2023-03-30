export default async function handler(req, res) {

    if (req.method !== "POST") {
      return res.status(405).end(`Method : ${req.method} not allowed`);
    }
  
    // Get data submitted in request's body.
    const { token } = JSON.parse(req.body);
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!token) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'email or password or device id not found' })
    }
  
    //make request to Venmo for source
    const url = 'https://api.venmo.com/v1/oauth/access_token';
    const options = {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
    }
  
    let response_body = {
      errorType: 0,
      errorMessage : "",
      success: false,
    }
  
    return await fetch(url, options).then((response) => {
      console.log(response);
      if (response.status == 401 || response.status == 204) { //these are the success statuses
        response_body.success = true;
        response_body["additionalInfo"] = response.json();
        return response_body;
      }
      response_body.errorType = response.status;
      response_body.errorMessage = "Received a " + response.status + " error";
      return response_body;
      //return response.json();
    }).then((result) => {
      return res.status(200).json(result);
    }).catch((error) => { console.log(error); return res.status(500).json({ errorMessage: 'Internal API error' }) })
  
  }