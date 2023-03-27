export default async function handler(req, res) {

    if (req.method !== "POST") {
      return res.status(405).end(`Method : ${req.method} not allowed`);
    }
  
    // Get data submitted in request's body.
    const { token, funding_source_id, user_id, amount } = JSON.parse(req.body);
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!token || !funding_source_id || !user_id || !amount) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'email or password or device id not found' })
    }
  
    // Found the name.
    // Sends a HTTP success code
    const body = JSON.stringify({
        "funding_source_id": funding_source_id,
        "metadata": {
          "quasi_cash_disclaimer_viewed": false
        },
        "user_id": user_id,
        "audience": "private",
        "amount": amount,
        "note": "BillMates made transaction"
    });
    //make request to Venmo
    const url = 'https://api.venmo.com/v1/payments';
    const options = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: body,
    }
  
    let response_body = {
      errorType: 0,
      errorMessage: "",
      success: false
    }
  
    return await fetch(url, options).then((response) => {
      if (response.status == 200) {
        response_body.success = true;
        return response_body;
      }
      if (response.status == 401) { //Bad token
        response_body.errorMessage = "Invalid OAuth Token";
        response_body.errorType = 401;
        return response_body;
      }
      response_body.errorMessage = "Received an error";
      response_body.errorType = response.status;
      console.log(response);
      return response_body;
      //return response.json();
    }).then((result) => {
      return res.status(200).json(result);
    }).catch((error) => { console.log(error); return res.status(500).json({ errorMessage: 'Internal API error' }) })
  
  }