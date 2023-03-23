

let response_body = {
    errorType : "none",
    success : false,
}

//if conditional to check parameters are safe
if (email != null || data != correct || ...) {
    response_body.errorType = LAMBDA_RESP.MALFORMED;
    return response_body;
}

const json_body = {
}
const endpoint = 'LAMBDA URL'
const options = {
    method: 'POST',
    mode : 'cors',
    headers: {
        'Content-Type': 'application/json',
        'token' : serverRuntimeConfig.LAMBDA_TOKEN
    },
    body: JSON.stringify(json_body),
}

return fetch(endpoint, options).then( (response) => {
    if (response.status == 400) {
        console.log("400 error");
        return LAMBDA_RESP.FOURHUNDREDERR;
    }
    return response.json();
})
.then( (result) => {
    if (result == LAMBDA_RESP.FOURHUNDREDERR) {
        response_body.errorType = LAMBDA_RESP.FOURHUNDREDERR
        return response_body;
    }
    if (!result.token_success || !result._success) { //adabt to specific return attribute
        return response_body;
    }
    response_body.success = true;
    response_body = {
        errorType : "none",
        success : true,
        ...result
    }
    return response_body;
})
.catch( (error) => {console.log(error); return response_body} );