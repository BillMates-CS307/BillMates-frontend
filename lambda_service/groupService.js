import { LAMBDA_RESP } from "@/lib/constants";
import { getCookie } from "cookies-next";

export const group_methods = {
    payWithVenmo,
    getSelfTargetVenmoAuth,
    getAllVenmoAuth,
    addUserToGroup,
    archiveGroup,
    deleteGroup,
    fulfillExpense,
    getAllGroupsInfo,
    getGroupInfo,
    reportExpense,
    resetGroup,
    submitExpense,
    submitPayout,
    updateGroupSettings,
    updatePendingStatus,
    updateReportStatus,
    voidExpense,
    updateGroupSettings,
    kickUserFromGroup
}

async function resetGroup(groudId) {
    let response_body = {
        errorType : 0,
        errorMessage : "",
        success : false
    }
    // if (email == null) {
    //     response_body.errorType = LAMBDA_RESP.MALFORMED;
    //     return response_body;
    // }

   let request_body = JSON.stringify(
    {
        group_id : groudId
    }
   )

   const path = '/api/reset_group'

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
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        } else if (!result.reset_success) {
            response_body.errorType = 1;
            response_body["errorMessage"] = "Could reset group";
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

async function deleteGroup(groudId) {
    let response_body = {
        errorType : 0,
        errorMessage : "",
        success : false
    }
    // if (email == null) {
    //     response_body.errorType = LAMBDA_RESP.MALFORMED;
    //     return response_body;
    // }

   let request_body = JSON.stringify(
    {
        group_id : groudId
    }
   )

   const path = '/api/delete_group'

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
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        } else if (!result.delete_success) {
            response_body.errorType = 1;
            response_body["errorMessage"] = "Could not kick user";
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

async function archiveGroup(groudId) {
    let response_body = {
        errorType : 0,
        errorMessage : "",
        success : false
    }
    // if (email == null) {
    //     response_body.errorType = LAMBDA_RESP.MALFORMED;
    //     return response_body;
    // }

   let request_body = JSON.stringify(
    {
        group_id : groudId
    }
   )

   const path = '/api/archive_group'

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
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        } else if (!result.group_archive_success) {
            response_body.errorType = 1;
            response_body["errorMessage"] = "Could not kick user";
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

async function kickUserFromGroup(groudId, userId) {
    let response_body = {
        errorType : 0,
        errorMessage : "",
        success : false
    }
    // if (email == null) {
    //     response_body.errorType = LAMBDA_RESP.MALFORMED;
    //     return response_body;
    // }

   let request_body = JSON.stringify(
    {
        group_id : groudId,
        email : userId
    }
   )

   const path = '/api/kick_user'

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
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        } else if (!result.delete_success) {
            response_body.errorType = 1;
            response_body["errorMessage"] = "Could not kick user";
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

async function getAllGroupsInfo (email) {
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
        email : email
    }
   )

   const path = '/api/get_all_groups_data';

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
        } else if (!result.get_success) {
            return request_body;
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

async function getGroupInfo (groudId, email) {
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
        group_id : groudId
    }
   )

   const path = '/api/get_group_data'

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
        } else if (!result.get_success) {
            return request_body;
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
async function updateGroupSettings(groudId, fulfillment, autoApprove, maxChar) {
    let response_body = {
        errorType : 0,
        errorMessage : "",
        success : false
    }
    // if (email == null) {
    //     response_body.errorType = LAMBDA_RESP.MALFORMED;
    //     return response_body;
    // }

   let request_body = JSON.stringify(
    {
        group_id : groudId,
        fufillment : fulfillment,
        auto_approve : autoApprove,
        max_char : maxChar
    }
   )

   const path = '/api/update_settings'

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
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        } else if (!result.change_success) {
            response_body.errorType = 1;
            response_body["errorMessage"] = "Could not change settings";
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
async function reportExpense(id, email) {
        let response_body = {
            errorType : 0,
            success : false
        }
       let request_body = JSON.stringify(
        {
            expense_id : id,
            email : email
        }
       )
    
       const path = '/api/report_expense'
    
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
            console.log(result);
            if (result.errorType) {
                response_body["errorMessage"] = "Received a " + result.errorType + " error";
                return response_body;
            } else if (!result.contest_success) {
                response_body.errorType = 1;
                response_body["errorMessage"] = "This expense does not exist";
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
async function voidExpense(id) {
    let response_body = {
        errorType : 0,
        success : false
    }
   let request_body = JSON.stringify(
    {
        expense_id : id,
        remove : true
    }
   )

   const path = '/api/void_expense'

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
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        } else if (!result.remove_success) {
            response_body.errorType = 1;
            response_body["errorMessage"] = "This expense does not exist";
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

async function fulfillExpense(email, expense_id, amount, type) {
    let response_body = {
        errorType : 0,
        success : false
    }
    if (email == null || expense_id == null || amount == null) {
        response_body.errorType = LAMBDA_RESP.MALFORMED;
        response_body.errorMessage = "Malformed body (null)"
        return response_body;
    }

   let request_body = JSON.stringify(
    {
        email : email,
        expense_id : expense_id,
        amount : amount,
        payment_method : type
    }
   )

   console.log(request_body);

   const path = '/api/fulfill_expense'

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
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        } else if (!result.pay_success) {
            // response_body.errorType = 1;
            // response_body["errorMessage"] = "Expense does not exist";
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
async function updatePendingStatus(accepted, payment_id) {
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
        accepted : accepted,
        payment_id : payment_id
    }
   )

   const path = '/api/update_pending'

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
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        } else if (!result.handle_success) {
            response_body.errorType = 1;
            response_body["errorMessage"] = "This expense does not exist";
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
async function updateReportStatus(remove, expense_id) {
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
        remove : remove,
        expense_id : expense_id
    }
   )

   const path = '/api/update_report'

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
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        } else if (!result.remove_success) {
            response_body.errorType = 1;
            response_body["errorMessage"] = "This expense does not exist";
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
async function submitExpense({title, groupId, expense, total, owner, comment}) {
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
        title : title,
        group_id : groupId,
        expense : expense,
        total : total,
        owner : owner,
        comment : comment
    }
   )

   const path = '/api/create_expense'

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
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        }else if (!result.submit_success) {
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
async function submitPayout({title, groupId, expense, total, owner, comment}) {
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
        title : title,
        group_id : groupId,
        expenses : expense,
        total : total,
        email : owner,
        comment : comment
    }
   )

   const path = '/api/payout'

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
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        }else if (!result.pay_success) {
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

async function addUserToGroup(email, groudId) {
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
        uuid : groudId
    }
   )

   const path = '/api/join_group'

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
        console.log(result);
        if (result.errorType) {
            response_body["errorMessage"] = "Received a " + result.errorType + " error";
            return response_body;
        } else if (result.ERROR == "No such group") {
            response_body.errorType = LAMBDA_RESP.NO_SUCH_GROUP;
            response_body["errorMessage"] = "This group does not exist";
            return response_body;
        } else if (!result.group_add_success) {
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

async function payWithVenmo(sourceToken = "", targetTokens = [], amounts = []) {
    targetTokens.push(sourceToken);
    const venmo_ids = await getVenmoId(targetTokens);
    //for each ID, make payment by amount
    for (let i = 0; i < amounts.length; i++) {
        //fetch and return result (do synchronously)
    }
}

async function getAllVenmoAuth(targetIds = []) {
    //response from lambda
    let response_body = {
        errorType : 0,
        errorMessage : "",
        get_success : false,
        venmo_token : null
    }
    // Form the request for sending data to the server.
    const options = {
      method: 'POST',
      mode : 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: ""
    }
    const resulting_tokens = new Array(targetIds.length + 1);
    resulting_tokens.fill(null);
    //get self token from cookie
    resulting_tokens[targetIds.length] = getCookie("venmo-access-token") || null;
    if (resulting_tokens[targetIds.length] == null) {
        return resulting_tokens;
    }
    
    for (let i = targetIds.length - 1; i >=0; i--) {
            options.body = JSON.stringify({
                email : targetIds[i]
            });
            resulting_tokens[i] = fetch("/api/get_user_token", options);
    }
    const responses = await Promise.all(resulting_tokens); 
    const promises = responses.map((response) => {
        if (typeof response == "string") { //self token
            response_body.venmo_token = response;
            response_body.get_success = true;
            return response_body;
        }
        if (response.status != 200) { //error occured
            response_body.errorType = response.status;
            response_body.errorMessage = "Received a " + response.status;
            return response_body;
        } else {
            return response.json();
        }
    });
    return await Promise.all(promises).then( (parsedResponses) => {
        const res = parsedResponses.map( (r) => {
            console.log(r);
            if (r.get_success) {
                return r.venmo_token;
            } else {
                return null;
            }
        });
        return res;
    });
}

async function getVenmoId(tokens = []) {
    const authTokens = tokens.map((value) => {
        return "Bearer " + value;
    });
    console.log(authTokens);
    //response from venmo
    let response_body = {
        errorType : 0,
        errorMessage : "",
        user_data : {}
    }
    // Form the request for sending data to the server.
    const options = {
      method: 'POST',
      mode : 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: ""
    }
    const resulting_userInfo = new Array(authTokens.length);
    resulting_userInfo.fill(null);
    
    for (let i = authTokens.length - 1; i >=0; i--) {
            options.body = JSON.stringify({
                token : authTokens[i]
            });
            resulting_userInfo[i] = fetch((i == authTokens.length - 1)? "/api/venmo_get_payment_method" : 
            "/api/get_venmo_user_info", options);
    }
    const responses = await Promise.all(resulting_userInfo); 
    const promises = responses.map((response) => {
        if (response.status != 200) { //error occured
            response_body.errorType = response.status;
            response_body.errorMessage = "Received a " + response.status;
            response_body.user_data = {};
            return response_body;
        } else {
            return response.json();
        }
    });
    const userData = await Promise.all(promises);
    console.log(userData);
    //last index is the source token
    let return_body = {
        default_source_id : "",
        target_ids : new Array(authTokens.length - 1)
    }
    let default_source_id = "";
    for (let payment of userData[userData.length - 1].user_data) {
        if (payment.default_transfer_destination == "eligible") {
            default_source_id = payment.id;
            break;
        }
    }
    if (default_source_id == "") { //nothing "eligible" idk
        default_source_id = userData[userData.length - 1].user_data[0].id;
    }
    return_body.default_source_id = default_source_id;

    //everything else are targets
    for (let k = 0; k < authTokens.length - 1; k++) {
        return_body.target_ids[k] = userData[k].user_data.id;
    }

    return return_body;
}



async function getSelfTargetVenmoAuth(targetId) {
    let response_body = {
        errorType : 0,
        errorMessage : "",
        success : false,
        token : null
    }
    // Form the request for sending data to the server.
    const options = {
      method: 'POST',
      mode : 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: ""
    }
    const resulting_tokens = [null, null];
    //get self token from cookie
            resulting_tokens[1] = getCookie("venmo-access-token") || null;
            if (resulting_tokens[1] == null) {
                return resulting_tokens;
            }
            options.body = JSON.stringify({
                email : targetId
            });
            resulting_tokens[0] = await fetch("/api/get_user_token", options).then( (internalResponse) => {
                if (internalResponse.status != 200) {
                    response_body.errorType = internalResponse.status;
                    response_body.errorMessage = "Received a " + internalResponse;
                    return response_body;
                } else {
                    return internalResponse.json();
                }
            }).then( (lambdaResult) => {
                console.log(lambdaResult);
                if (lambdaResult.errorType) {
                    return null;
                }
                if (!lambdaResult.get_success) {
                    return null;
                }
                return lambdaResult.venmo_token;
            });
            return resulting_tokens;
}

async function getDefaultPaymentMethod(token) {
    let response_body = {
        errorType : 0,
        errorMessage : "",
        success : false,
        methods : []
    }
    // Form the request for sending data to the server.
    const options = {
      method: 'POST',
      mode : 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token : token})
    }
    const response = await fetch('/api/get_payment_methods', options).then( (initialResponse) => {
        if (initialResponse.status != 200) {
            response_body.errorType = initialResponse.status;
            response_body.errorMessage = "Received a " + initialResponse.status;
            return response_body;
        }
        return initialResponse.json();
    }).then( (venmoResponse) => {
        if (venmoResponse.errorType) {
            response_body.errorType = venmoResponse.status;
            response_body.errorMessage = "Received a " + venmoResponse.status;
            return response_body;  
        }
        return venmoResponse;
    });

    let method = null;

    for (let paymentMethod of response) {
        console.log(paymentMethod);
    }
    return method;
}