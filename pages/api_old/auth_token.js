import { serverRuntimeConfig } from "@/next.config";
import jwt from "jsonwebtoken"

export default async function handler(req, res) {
    if (req.method !== "POST")  {
        return res.status(405).end(`Method : ${req.method} not allowed`);
    }


    // Get data submitted in request's body.
    const req_body = JSON.parse(req.body);
    console.log(req_body);
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!req_body.email || !req_body.parameter) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'email or token not found' })
    }
  
    // Found the name.
    // Sends a HTTP success code

    //validate JWT
    jwt.verify(req_body.parameter, serverRuntimeConfig.JWT_TOKEN, {sub : req_body.email}, function(err, decoded) {
        if (err == "invalid sub") {
            return res.status(200).json({result : false});
        }
        return res.status(200).json({result : true});
    });
  }