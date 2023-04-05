import { serverRuntimeConfig } from "@/next.config";
import { LAMBDA_RESP } from "@/lib/constants";

export const group_methods = {
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
    kickUserFromGroup,
    getAnalytics
}

async function getAnalytics(userId, groupId) {
    let response_body = {
        success : false,
        errorType : 0,
        errorMessage : "",
        data : null
    }

    const request_body = JSON.stringify({
        "user_id" : userId,
        "group_id" : groupId
    });

    const options = {
        method: 'POST',
        mode : 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: request_body
    }

    return await fetch("/api/analytics_get_all_info", options).then( (response) => {
        if (response.status == 400 || response.status == 500 || response.status == 502) {
            response_body.errorMessage = "Could not service this request right now.\nPlease try again later";
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) { //Lambda response doesn't have this field
            return result;
        } else if (!result.get_success) { //idk what would cause this besides an error
            response_body.errorType = 1;
            response_body.errorMessage = "Could not service this request right now.\nPlease try again later";
            return response_body;
        }
        response_body.success = true;
        response_body.data = result.data; //TODO : CHANGE TO CORRECT FIELD WHEN BACKEND IS DONE WITH IT
        return response_body;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = 2;
        response_body.errorMessage = "Internal parsing error";
        return response_body;
    });
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