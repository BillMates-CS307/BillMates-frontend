import jwt from "jsonwebtoken"
import { serverRuntimeConfig } from "@/next.config";
import { getCookies, setCookie, deleteCookie, hasCookie, getCookie } from 'cookies-next';


export const userService = {
    authenticateToken,
    authenticateCredentials,
    register,
    getUserFromToken,
    signout
};


function signout() {
  deleteCookie('JWT_Token', {path : "/", domain : "localhost"});
}

//server side function only
function getUserFromToken({req, res}) {
  if (hasCookie('JWT_Token', {req, res})) {
    const token = getCookie('JWT_Token', { req, res });
    return jwt.verify(token, serverRuntimeConfig.JWT_TOKEN, function(err, decoded) {
      if (decoded == undefined) {
          deleteCookie('JWT_Token', {req, res});
          return {email : null, name : null, token : null};
      }
      return {email : decoded.email, token : token};
  });
  } else {
    return {email : null, name : null, token : null};
  }
}

function authenticateToken(token, email) {
    const data = {
        parameter : token,
        email : email
    }
    const JSONdata = JSON.stringify(data);
    const endpoint = '/api/auth_token'

    // Form the request for sending data to the server.
    const options = {
      method: 'POST',
      mode : 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }

    try {
        return fetch(endpoint, options).then( (response) => {
            return response.json().then( (val) => {return val.result;} );
        }).catch( (error) => {console.log(error); return false;});

    } catch (e) {
        return false;
    }
}

async function authenticateCredentials(e, p) {
    const data = {
        email : e,
        password : p
    }
    const JSONdata = JSON.stringify(data);
    const endpoint = '/api/signin_api'

    // Form the request for sending data to the server.
    const options = {
      method: 'POST',
      mode : 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }

    try {
      const response = await fetch(endpoint, options);
      if (response.status == 400) {
        alert("Unable to find form fields");
        return {status : "error", token : null};
      }
      const result = await response.json();
      if (!result.token_success) {
        return {status : "token", token : null};
      }
      if (!result.login_success) {
        return {status : "invalid", token : null};
      }
      setCookie('JWT_Token', result.token);
      return {status : "success", token : result.token};
    } catch(e) {
        console.log(e);
        return {status : "error", token : null};
    }
}

function register(email, name, password) {
    
}