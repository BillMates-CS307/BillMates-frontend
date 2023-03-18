export default async function handler(req, res) {

    if (req.method !== "POST")  {
      return res.status(405).end(`Method : ${req.method} not allowed`);
    }


      // Get data submitted in request's body.
      const {group_id} = JSON.parse(req.body);
const data = {
    group_id : group_id
  };
  const JSONdata = JSON.stringify(data);
  const endpoint = 'https://zp6hyrzgyuocojaqm6ahxc5wxm0rjujf.lambda-url.us-east-2.on.aws/'

  // Form the request for sending data to the server.
  const options = {
    method: 'POST',
    mode : 'cors',
    headers: {
      'Content-Type': 'application/json',
      'token' : 'zpdkwA.2_kLU@zg'
    },
    body: JSONdata
  }
  const lambda_resp = await fetch(endpoint, options);
  const lambda_data = await lambda_resp.json();

  return res.status(200).json(lambda_data);



}