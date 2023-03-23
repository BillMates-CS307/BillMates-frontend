import jwt from 'jsonwebtoken';
import { serverRuntimeConfig } from '@/next.config';

export default async function handler(req, res) {

  if (req.method !== "POST")  {
    return res.status(405).end(`Method : ${req.method} not allowed`);
  }

    // Get data submitted in request's body.
    const {token} = JSON.parse(req.body);
    let response_body = {
        errorType : 0,
        success : true,
    }
    try {
        response_body["payload"] = jwt.verify(token, serverRuntimeConfig.JWT_TOKEN);
    } catch (e) {
        response_body.success = false;
    }
    return res.status(200).json(response_body);
  }