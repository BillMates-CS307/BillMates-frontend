import { serverRuntimeConfig } from "@/next.config";
import { LAMBDA_RESP } from "@/lib/constants";
import jwt from 'jsonwebtoken';
import { getCookies, setCookie, deleteCookie, hasCookie, getCookie } from 'cookies-next';
import { useRouter } from "next/router";


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
    deleteJWT,
    signOut,
    createGroup,
    getUserId,
}

function getUserId() {
    let token = null;
    if (!(token = getCookie("JWT_Token"))) {
        token = localStorage.getItem("token");
    }
    const innerFunc = async (value) => {
        let response_body = {
            errorType : 0,
            success : false
        }
    
       let request_body = JSON.stringify(
        {
            token : value
        }
       )
    
       const path = '/api/validate_token'
    
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
            // else if (!result.login_success) {
            //     response_body["attemps"] = result.user_data.attempts;
            //     return response_body;
            // }
    
            result = {
                errorType : 0,
                success : true,
                ...result
            }
            //set JWT token based on cookie preference
            setJWT(result.token_l, result.token_c);
            return result;
        }).catch( (error) => {
            console.log(error);
            response_body.errorType = LAMBDA_RESP.ERROR;
            return response_body;
        }); 
    }
    return token;
}

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

function setJWT(token_l, token_c=null) {
    localStorage.setItem("token",token_l);
    if (token_c) {
        setCookie("JWT_Token", token_c, {maxAge: 60 * 60 * 24 * 7, sameSite:"strict"});
    }
}

async function validateLoginCredential (email, password, createJWT=false) {
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
        setJWT(result.token_l, result.token_c);
        return result;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = LAMBDA_RESP.ERROR;
        return response_body;
    });
}

async function validateLoginJWT(pushSignIn=true){
    //check if cookie is assigned and valid
    let token = null;
    if (!hasCookie("JWT_Token")) { //no cookie, check localStorage
        if (!(token = localStorage.getItem("token"))) {
            if (pushSignIn) {
                console.log("Before");
                window.location.href = "http://localhost:8000/Refactored/";
                return false;
            }
            return false;
        }
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
        // else if (!result.login_success) {
        //     response_body["attemps"] = result.user_data.attempts;
        //     return response_body;
        // }
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
function deleteJWT(){
    return;
}
async function signOut(){
    return;
}