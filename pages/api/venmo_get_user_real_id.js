export default async function handler(req, res) {

    if (req.method !== "POST") {
      return res.status(405).end(`Method : ${req.method} not allowed`);
    }
  
    // Get data submitted in request's body.
    const { token, id } = JSON.parse(req.body);
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!token) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'email or password or device id not found' })
    }
  
    //make request to Venmo for source
    const url = "https://api.venmo.com/v1/users/" + id;
    const options = {
      method: 'GET',
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
      userId : null
    }
  
    return await fetch(url, options).then((response) => {
      console.log("======================VENMO_GET_REAL_USERID_RESPONSE======================");
      console.log(response);
      if (response.status == 200) {
        return response.json();
      }
      if (response.status == 401) { //bad token
        response_body.errorType = 401;
        response_body.errorMessage = "Invalid OAuth Token provided"
        return response_body;
      }
      response_body.errorType = response.status;
      response_body.errorMessage = "Received a " + response.status + " error";
      return response_body;
      //return response.json();
    }).then((result) => {
        console.log(result);
        if (result.errorType == undefined) {
            response_body.userId = result.data.id;
            response_body.success = true;
        }
      return res.status(200).json(response_body);
    }).catch((error) => { console.log(error); return res.status(500).json({ errorMessage: 'Internal API error' }) })
  
  }