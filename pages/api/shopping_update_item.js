import { serverRuntimeConfig } from '@/next.config';
import { printLogHeading } from '../global_components/logging';


export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).end(`Method : ${req.method} not allowed`);
      }
    
      // Get data submitted in request's body.
      const { item_name, list_id, remove_item } = JSON.parse(req.body);
    
      // Guard clause checks for first and last name,
      // and returns early if they are not found
      if ( item_name == null | remove_item == null | list_id == null ) {
        // Sends a HTTP bad request error code
        printLogHeading("UPDATE_ITEM_SHOPPING_LIST", 400);
        console.log("Undefined parameter");
        return res.status(400).json();
      }
    
      // Found the name.
      // Sends a HTTP success code
    
      //make request to Lambda
      const url = 'https://ce6mzuwdkc7ebhnuxbik42hz5q0xxekz.lambda-url.us-east-2.on.aws/';
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
        if (remove_item) {
          printLogHeading("REMOVE_ITEM_FROM_SHOPPING_LIST", response.status);
        } else {
          printLogHeading("ADD_ITEM_TO_SHOPPING_LIST", response.status);
        }
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
        if (remove_item) {
          printLogHeading("REMOVE_ITEM_FROM_SHOPPING_LIST", 500);
        } else {
          printLogHeading("ADD_ITEM_TO_SHOPPING_LIST", 500);
        }
        console.log(error); 
        return res.status(500).json(); 
      })


}