export default async function handler(req, res) {
  // Get data submitted in request's body.
  const req_body = JSON.parse(req.body);

  // Guard clause checks for first and last name,
  // and returns early if they are not found
  // if (
  //   !req_body.name ||
  //   !req_body.oldPassword ||
  //   !req_body.newPassword ||
  //   !req_body.notification
  // ) {
  //   // Sends a HTTP bad request error code
  //   return res
  //     .status(400)
  //     .json({ data: "name, password, or notification not found" });
  // }

  // Found the name.
  // Sends a HTTP success code

  //make request to Lambda
  const body_json = { ...req_body };
  const url =
    "https://yimbhwmzyzeikdbjqylkdonwoy0czhwq.lambda-url.us-east-2.on.aws/";
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
