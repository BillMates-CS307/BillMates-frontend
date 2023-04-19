import { serverRuntimeConfig } from '@/next.config';
import { printLogHeading } from '../global_components/logging';


export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).end(`Method : ${req.method} not allowed`);
      }
    
      // Get data submitted in request's body.
      const { recurring_expense_id, group_id } = JSON.parse(req.body);
    
      // Guard clause checks for first and last name,
      // and returns early if they are not found
      if ( recurring_expense_id == null | group_id == null ) {
        // Sends a HTTP bad request error code
        printLogHeading("REMOVE_RECURRING_EXPENSE", 400);
        console.log("Undefined parameter"); 
        return res.status(400).json();
      }
    
      // Found the name.
      // Sends a HTTP success code
    
      //make request to Lambda
      const url = 'https://blrjgnkgkeggkgoiagtgktfgfy0xiemu.lambda-url.us-east-2.on.aws/';
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'token': serverRuntimeConfig.LAMBDA_TOKEN
        },
        body: req.body,
      }
    
      return await fetch(url, options).then((response) => {
        printLogHeading("REMOVE_RECURRING_EXPENSE", response.status);
        // console.log(response);
        if (response.status != 200) {
          return response;
        }
        return response.json();
      }).then((result) => {
        console.log(result);
        if (result.status) { //non-200 response from lambda
            return res.status(result.status).json();
        }
        return res.status(200).json(result);
      }).catch((error) => {         
        printLogHeading("REMOVE_RECURRING_EXPENSE", 500);
        console.log(error); 
        return res.status(500).json();  
      });


}