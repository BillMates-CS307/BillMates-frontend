export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

  // Get data submitted in request's body.
  const { object_id } = JSON.parse(req.body);
  console.log(object_id);
  // Guard clause checks for first and last name,
  // and returns early if they are not found
  //   if (!isAccepted || !amountPaying || !expense) {
  //     // Sends a HTTP bad request error code
  //     return res.status(400).json({ data: 'acceptance, amount, or expense not found' })
  //   }

  // Found the name.
  // Sends a HTTP success code

  //make request to Lambda
  const body_json = { object_id };
  const url =
    "https://wzqss3razlwkrdnwdm6nr4vx6i0rxnqn.lambda-url.us-east-2.on.aws/";
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      token: "zpdkwA.2_kLU@zg",
    },
    body: JSON.stringify(body_json),
  };

  const lambda_resp = await fetch(url, options);
  const lambda_data = await lambda_resp.json();

  return res.status(200).json(lambda_data);
}
