import { LAMBDA_RESP } from "@/lib/constants";
import { getCookies, setCookie, deleteCookie, hasCookie, getCookie } from 'cookies-next';


/*

returns an object of the form 

{
    errorType (integer)
    success (boolean)
    ...result (other parameters returned from lambda call)
}

*/
export const user_methods = {
    validateLoginCredential,
    validateLoginJWT,
    registerAccount,
    getUserData,
    updateSettings,
    signOut,
    createGroup,
    loginVenmoWithCredentials,
    sendVenmoSms,
    loginVenmoWithOtp,
    payUserWithVenmo,
    getIdsFromVenmo,
    getSelfVenmoToken,
    getVenmoAuthToken,
    getUserByUsername
}


async function getUserByUsername(token, username) {
    let response_body = {
        errorType : 0,
        errorMessage : "",
        success : false,
        id : null
    }

    if (username == null) {
        response_body.errorType = 1;
        response_body.errorMessage = "Malformed Body";
        return response_body;
    }

    const request_body = JSON.stringify(
        {
            token : token,
            id : username
        }
    )
    const path = '/api/venmo_get_user_real_id'

    // Form the request for sending data to the server.
    const options = {
      method: 'POST',
      mode : 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: request_body
    }

    return await fetch(path, options).then( (response) => {
        if (response.status == 400 || response.status == 500) {
            response_body.errorType = response.status;
            response_body.errorMessage = "Received a " + response_body.errorType + " error";
            return response_body;
        }
        return response.json();
    }).then((result) => {
        console.log(result);
        if (result.success && result.get_success) {
            response_body.success = true;
            response_body.id = result.id;
        }
        return response_body;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = LAMBDA_RESP.ERROR;
        return response_body;
    });
}

async function getVenmoAuthToken(userId) {
    let response_body = {
        errorType : 0,
        errorMessage : "",
        success : false,
        token : null
    }

    if (userId == null) {
        response_body.errorType = 1;
        response_body.errorMessage = "Malformed Body";
        return response_body;
    }

    const request_body = JSON.stringify(
        {
            email : userId
        }
    )
    const path = '/api/get_venmo_token'

    // Form the request for sending data to the server.
    const options = {
      method: 'POST',
      mode : 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: request_body
    }

    return await fetch(path, options).then( (response) => {
        if (response.status == 400 || response.status == 500) {
            response_body.errorType = response.status;
            response_body.errorMessage = "Received a " + response_body.errorType + " error";
            return response_body;
        }
        return response.json();
    }).then((result) => {
        console.log(result);
        if (result.success && result.get_success) {
            response_body.success = true;
            response_body.token = result.venmo_token;
        }
        return response_body;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = LAMBDA_RESP.ERROR;
        return response_body;
    });
}
function getSelfVenmoToken() {
    let response_body = {
        errorType : 0,
        errorMessage : "",
        success : false,
        token : null
    }
    try {
        response_body.token = getCookie("venmo-access-token") || null;
        if (response_body.token != null) {
            response_body.success = true;
        }
    } catch (error) {
        response_body.errorType = 1;
        response_body.errorMessage = "An error occured";
        console.log(error);
    } finally {
        return response_body;
    }
}

async function getIdsFromVenmo(selfToken, targetToken) {
    let response_body = {
        errorType : 0,
        success : false
    }
    if (selfToken == null || targetToken == null) {
        response_body.errorType = LAMBDA_RESP.MALFORMED;
        return response_body;
    }

   let request_body = JSON.stringify(
    {
        token : selfToken
    }
   )

   const path = '/api/venmo_get_user_id'

   // Form the request for sending data to the server.
   let options = {
     method: 'POST',
     mode : 'no-cors',
     headers: {
       'Content-Type': 'application/json',
     },
     body: request_body
   }

   const self_response = fetch('/api/venmo_get_payment_method', options).then( (response) => {
        if (response.status == 400 || response.status == 500) {
            response_body.errorType = response.status;
            return response_body;
        }
        return response.json();
    }).then((result) => {
        console.log("====================PAYMENT_METHODS=======================================================");
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = result.errorMessage;
            return response_body;
        }
        return result;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = LAMBDA_RESP.ERROR;
        return response_body;
    });

    request_body = JSON.stringify(
        {
            token : targetToken
        }
       )
       options = {
        method: 'POST',
        mode : 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: request_body
      }
    const target_response = fetch(path, options).then( (response) => {
        if (response.status == 400 || response.status == 500) {
            response_body.errorType = response.status;
            return response_body;
        }
        return response.json();
    }).then((result) => {
        console.log("====================TARGET_DATA=======================================================");
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = result.errorMessage;
            return response_body;
        }
        return result;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = LAMBDA_RESP.ERROR;
        return response_body;
    });

    //const final_response = getUserByUsername(selfToken, target_response.userId);
    
    return [await self_response, await target_response];
}

async function payUserWithVenmo(token, amount, sourceId, targetId) {
    console.log("Inside pay with venmo ==============================================================================");
    let response_body = {
        errorType : 0,
        errorMessage : "",
        success : false
    }
    if (token == null || sourceId == null || targetId == null) {
        response_body.errorType = LAMBDA_RESP.MALFORMED;
        return response_body;
    }

   let request_body = JSON.stringify(
    {
        token : token,
        funding_source_id : sourceId,
        user_id : targetId,
        amount : amount
    }
   )


   console.log(request_body);

   const path = '/api/venmo_pay'

   // Form the request for sending data to the server.
   const options = {
     method: 'POST',
     mode : 'no-cors',
     headers: {
       'Content-Type': 'application/json',
     },
     body: request_body
   }

   return await fetch(path, options).then( (response) => {
        if (response.status == 400 || response.status == 500) {
            response_body.errorType = response.status;
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) {
            response_body.errorMessage = result.errorMessage;
            return response_body;
        }
        return result;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = 1;
        response_body.errorMessage = "Error in userServer parse";
        return response_body;
    });     
}


/*
Attemps login with one time password sent via text

params: 
device_id : string (random string generated in loginVenmoWithCredentials)
secret : string (returned from loginVenmoWithCredentials)
otpCode : string (6 digit number sent to user via sendVenmoSms)

return:
{
    errorType : int (number corresponding to error)
    errorMessage : string
    success : bool
}

Interpretation:
    success true -> otp was accepted
    success false -> otp expired or was wrong


TODO : actually test this
*/
async function loginVenmoWithOtp(device_id, secret, otpCode) {
    let response_body = {
        errorType : 0,
        success : false
    }
    if (device_id == null || secret == null || otpCode == null) {
        response_body.errorType = LAMBDA_RESP.MALFORMED;
        return response_body;
    }

   let request_body = JSON.stringify(
    {
        secret : secret,
        device_id : device_id,
        otp_code : otpCode
    }
   )

   const path = '/api/venmo_otp_login'

   // Form the request for sending data to the server.
   const options = {
     method: 'POST',
     mode : 'no-cors',
     headers: {
       'Content-Type': 'application/json',
     },
     body: request_body
   }

   return await fetch(path, options).then( (response) => {
        if (response.status == 400 || response.status == 500) {
            response_body.errorType = response.status;
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        }
        return result;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = LAMBDA_RESP.ERROR;
        return response_body;
    });  
}
/*
Sends otp via sms

params: 
device_id : string (random string generated in loginVenmoWithCredentials)
secret : string (returned from loginVenmoWithCredentials)

return:
{
    errorType : int (number corresponding to error)
    errorMessage : string
    success : bool
}

Interpretation:
    success true -> sms was sent
    success false -> secret has expired

*/
async function sendVenmoSms(device_id, secret) {
    let response_body = {
        errorType : 0,
        success : false
    }
    if (device_id == null || secret == null) {
        response_body.errorType = LAMBDA_RESP.MALFORMED;
        return response_body;
    }

   let request_body = JSON.stringify(
    {
        secret : secret,
        device_id : device_id
    }
   )

   const path = '/api/venmo_send_text'

   // Form the request for sending data to the server.
   const options = {
     method: 'POST',
     mode : 'no-cors',
     headers: {
       'Content-Type': 'application/json',
     },
     body: request_body
   }

   return await fetch(path, options).then( (response) => {
        if (response.status == 400 || response.status == 500) {
            response_body.errorType = response.status;
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        }
        return result;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = LAMBDA_RESP.ERROR;
        return response_body;
    });

}
/*
Attempts login with username and password to Venmo

params: 
email : string
password : string

return:
{
    errorType : int (number corresponding to error)
    errorMessage : string
    success : bool
}

Interpretation:
    success true -> user credentials accepted and needs 2-factor
    success false -> invalid credentials

*/
async function loginVenmoWithCredentials(email, password) {
    const TWO_FACTOR_ERROR_CODE = 81109;
    const random_device_id = () => {

    const BASE_DEVICE_ID = "88884260-05O3-8U81-58I1-2WA76F357GR9";
    const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","P","Q","R","S","T","U","V","W","X","Y","Z","O"];
    let result = [];
    for (let char in BASE_DEVICE_ID) {
        const code = char.charCodeAt(0);
        if ( code > 47 && code < 58) {
            result.push( Math.trunc(Math.random() * 10).toString() );
        } else if (code == 45) {
            result.push('-');
        }
        else {
            result.push( letters[ Math.trunc(Math.random() * 26) ] );
        }
    }
    return result.join("");
    }

    let response_body = {
        errorType : 0,
        success : false
    }
    if (email == null || password == null) {
        response_body.errorType = LAMBDA_RESP.MALFORMED;
        return response_body;
    }
    const deviceId  = random_device_id();
   let request_body = JSON.stringify(
    {
        email : email,
        password : password,
        device_id : deviceId
    }
   )

   const path = '/api/venmo_login'

   // Form the request for sending data to the server.
   const options = {
     method: 'POST',
     mode : 'no-cors',
     headers: {
       'Content-Type': 'application/json',
     },
     body: request_body
   }

   return await fetch(path, options).then( (response) => {
        if (response.status == 400 || response.status == 500) {
            response_body.errorType = response.status;
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        }
        if (!result.validLogin) {
            return response_body;
        }
        result = {
            errorType : 0,
            success : true,
            ...result
        }
        return result;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = LAMBDA_RESP.ERROR;
        return response_body;
    });

}


// function getUserId() {
//     let token = null;
//     if (!(token = getCookie("JWT_Token"))) {
//         token = localStorage.getItem("token");
//     }
//     const innerFunc = async (value) => {
//         let response_body = {
//             errorType : 0,
//             success : false
//         }
    
//        let request_body = JSON.stringify(
//         {
//             token : value
//         }
//        )
    
//        const path = '/api/validate_token'
    
//        // Form the request for sending data to the server.
//        const options = {
//          method: 'POST',
//          mode : 'no-cors',
//          headers: {
//            'Content-Type': 'application/json',
//          },
//          body: request_body
//        }
    
//        return await fetch(path, options).then( (response) => {
//             if (response.status == 400 || response.status == 500) {
//                 response_body.errorType = response.status;
//                 return response_body;
//             }
//             return response.json();
//         }).then((result) => {
//             if (result.errorType) {
//                 response_body["errorMessage"] = "Received a " + result.errorType + " error";
//                 return response_body;
//             } else if (result.ERROR == "No user found") {
//                 return response_body;
//             } 
//             // else if (!result.login_success) {
//             //     response_body["attemps"] = result.user_data.attempts;
//             //     return response_body;
//             // }
    
//             result = {
//                 errorType : 0,
//                 success : true,
//                 ...result
//             }
//             //set JWT token based on cookie preference
//             setJWT(result.token_l, result.token_c);
//             return result;
//         }).catch( (error) => {
//             console.log(error);
//             response_body.errorType = LAMBDA_RESP.ERROR;
//             return response_body;
//         }); 
//     }
//     return token;
// }

async function createGroup(email, name) {
    let response_body = {
        errorType : 0,
        success : false
    }
    // if (email == null) {
    //     response_body.errorType = LAMBDA_RESP.MALFORMED;
    //     return response_body;
    // }

   let request_body = JSON.stringify(
    {
        manager : email,
        name : name
    }
   )

   const path = '/api/create_group'

   // Form the request for sending data to the server.
   const options = {
     method: 'POST',
     mode : 'no-cors',
     headers: {
       'Content-Type': 'application/json',
     },
     body: request_body
   }

   return await fetch(path, options).then( (response) => {
        if (response.status == 400 || response.status == 500) {
            response_body.errorType = response.status;
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        }
        console.log(result);
        result = {
            errorType : 0,
            success : result.make_group_success,
        }
        return result;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = LAMBDA_RESP.ERROR;
        return response_body;
    });
}

function setJWT(token, isPersistant) {
    //localStorage.setItem("token",token_l);
    if (isPersistant) {
        setCookie("JWT_Token", token, {maxAge: 60 * 60 * 24 * 7, sameSite:"strict"});
    } else {
        setCookie("JWT_Token", token, {sameSite:"strict"});
    }
}

async function validateLoginCredential (email, password, createJWT=false, persistant=false) {
    let response_body = {
        errorType : 0,
        success : false
    }
    if (email == null) {
        response_body.errorType = LAMBDA_RESP.MALFORMED;
        return response_body;
    }

   let request_body = JSON.stringify(
    {
        email : email,
        password : password,
        createJWT : createJWT
    }
   )

   const path = '/api/validate_login'

   // Form the request for sending data to the server.
   const options = {
     method: 'POST',
     mode : 'no-cors',
     headers: {
       'Content-Type': 'application/json',
     },
     body: request_body
   }

   return await fetch(path, options).then( (response) => {
        if (response.status == 400 || response.status == 500) {
            response_body.errorType = response.status;
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        } else if (result.ERROR == "No user found") {
            return response_body;
        } 
        else if (!result.login_success) {
            response_body["attempsLeft"] = 2 - ((result.user_data.attempts - 1) % 3);
            return response_body;
        }

        result = {
            errorType : 0,
            success : true,
            ...result
        }
        //set JWT token based on cookie preference
        setJWT(result.token, persistant);
        return result;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = LAMBDA_RESP.ERROR;
        return response_body;
    });
}

async function validateLoginJWT(router=null){
    //check if cookie is assigned and valid
    let token = null;
    if (!hasCookie("JWT_Token")) { //both persistant and session will have same name
        if (router) {
            router.replace("/");
            return false;
        }
        return false;
    } else {
        token = getCookie("JWT_Token");
    }
    let response_body = {
        errorType : 0,
        success : false
    }

   let request_body = JSON.stringify(
    {
        token : token
    }
   )

   const path = '/api/validate_jwt'

   // Form the request for sending data to the server.
   const options = {
     method: 'POST',
     mode : 'no-cors',
     headers: {
       'Content-Type': 'application/json',
     },
     body: request_body
   }
   return await fetch(path, options).then( (response) => {
        if (response.status == 400 || response.status == 500) {
            response_body.errorType = response.status;
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        }
        if (!result.success) {
            deleteCookie("JWT_Token");
        }
        return result;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = LAMBDA_RESP.ERROR;
        return response_body;
    });
}


async function getUserData(email){
    let response_body = {
        errorType : 0,
        success : false
    }
    if (email == null) {
        response_body.errorType = LAMBDA_RESP.MALFORMED;
        return response_body;
    }

   let request_body = JSON.stringify(
    {
        email : email
    }
   )

   const path = '/api/get_user_data'

   // Form the request for sending data to the server.
   const options = {
     method: 'POST',
     mode : 'no-cors',
     headers: {
       'Content-Type': 'application/json',
     },
     body: request_body
   }

   return await fetch(path, options).then( (response) => {
        if (response.status == 400 || response.status == 500) {
            response_body.errorType = response.status;
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        }
        result = {
            errorType : 0,
            success : true,
            ...result
        }
        return result;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = LAMBDA_RESP.ERROR;
        return response_body;
    });
}

async function registerAccount(email, password, name){
    let response_body = {
        errorType : 0,
        success : false
    }
    // if (email == null) {
    //     response_body.errorType = LAMBDA_RESP.MALFORMED;
    //     return response_body;
    // }

   let request_body = JSON.stringify(
    {
        email : email,
        password : password,
        name : name
    }
   )

   const path = '/api/register_account'

   // Form the request for sending data to the server.
   const options = {
     method: 'POST',
     mode : 'no-cors',
     headers: {
       'Content-Type': 'application/json',
     },
     body: request_body
   }

   return await fetch(path, options).then( (response) => {
        if (response.status == 400 || response.status == 500) {
            response_body.errorType = response.status;
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        }
        if (!result.signup_success || !result.token_success) {
            return response_body;
        }
        response_body.success = true;
        return response_body;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = LAMBDA_RESP.ERROR;
        return response_body;
    });
}
async function updateSettings(){
    return;
}
async function signOut() {
    deleteCookie("JWT_Token");
    return;
}