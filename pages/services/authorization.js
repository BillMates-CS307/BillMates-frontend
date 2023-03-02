import jwt from "jsonwebtoken"
import { serverRuntimeConfig } from "@/next.config";
import { getCookies, setCookie, deleteCookie, hasCookie, getCookie } from 'cookies-next';


export const userService = {
    authenticateToken,
    authenticateCredentials,
    register,
    getEmailFromToken,
    addUserToGroup,
    deleteJwtToken,
    deleteJwtTokenServerSide,
    getUserData
};

//server side function only
async function getUserData(email) {
  let response_body = {
    user : null,
    status : "error"
  }
  if (typeof window === "undefined") {

    const data = {
      email : email
    };
    const JSONdata = JSON.stringify(data);
    console.log(data);
    const endpoint = 'https://spdzmxp6xdfjiwptqdabqgcy4q0rmcwt.lambda-url.us-east-2.on.aws/'
  
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
    return await fetch(endpoint, options).then( (response) => {
      if (response.status == 400) {
        console.log("400 error");
        return response_body;
      }
      return response.json();
      })
      .then( (result) => {
        console.log(result);
        if (!result.token_success) {
          response_body.status = "token";
          return response_body;
        }
        if (result.user == null) {
          response_body.status = "invalid";
          return response_body;
        }
          response_body.status = "success";
          response_body.user = result.user;
          return response_body;
      })
      .catch( (error) => {console.log(error); return response_body} );

  } else {
    return response_body;
  }
}

//server side function only
async function addUserToGroup(email, groupId) {
  if (typeof window === "undefined") {
    const data = {
      email : email,
      group_id : groupId
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = 'lamba_URL'
  
    // Form the request for sending data to the server.
    const options = {
      method: 'POST',
      mode : 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }
      return "invalid";
      return await fetch(endpoint, options).then( (response) => {
      if (response.status == 400) {
        console.log("400 error");
        return "error";
      }
      return response.json();
      })
      .then( (result) => {
        if (!result.token_success) {
          return "token";
        }
        //temp name
        if (!result.submit_sucess) {
          return "invalid";
        }
          return "success";
      })
      .catch( (error) => {console.log(error); return "error"} );
  } else {
    return "error";
  }
}

function deleteJwtToken() {
  console.log("being called");
  deleteCookie('JWT_Token');
}

function deleteJwtTokenServerSide({req, res}) {
  deleteCookie('JWT_Token', {req, res});
}

//server side function only
function getEmailFromToken({req, res}) {
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
      console.log(result);
      if (result.ERROR) {
        return {status : "invalid", token : null, attempsLeft : undefined}
      }
      if (!result.token_success) {
        return {status : "token", token : null, attempsLeft : undefined};
      }
      if (!result.login_success) {
        return {status : "invalid", token : null, attempsLeft : 2 - ((result.user_data.attempts - 1) % 3)};
      }
      setCookie('JWT_Token', result.token ,{maxAge: 60 * 60 * 24 * 7});
      return {status : "success", token : result.token, attempsLeft : 3};
    } catch(e) {
        console.log(e);
        return {status : "error", token : null, attempsLeft : undefined};
    }
}

async function register(data) {
  const JSONdata = JSON.stringify(data);
  const endpoint = '/api/register_api'
  const options = {
    method: 'POST',
    mode : 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSONdata,
  }

  return await fetch(endpoint, options).then( (response) =>  {
    return response.json()
  }).then( (result) => {
    if (!result.token_success) {
      return "error";
    }
    if (!result.signup_success) {
      return "email";
    }
    return "success";
  }).catch( (e) => {console.log(e); return "error"} )  
}