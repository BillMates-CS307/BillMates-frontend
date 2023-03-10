import { serverRuntimeConfig } from "@/next.config";


export const groupService = {
    payDebt,
    updatePendingState,
    submitExpense,
    addUserToGroup,
    getGroup,
    deleteGroup
}


async function submitExpense(expenseRequest) {
    //if (!authenticateToken) maybe later
    const data = expenseRequest;
    const JSONdata = JSON.stringify(data);
    const endpoint = '/api/submit_expense'
  
    // Form the request for sending data to the server.
    const options = {
      method: 'POST',
      mode : 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }
      return await fetch(endpoint, options).then( (response) => {
      if (response.status == 400) {
        alert("Unable to find form fields");
        return "error";
      }
      return response.json();
      })
      .then( (result) => {
        if (!result.token_success) {
          return "token";
        }
        if (!result.submit_success) {
          return "invalid";
        }
          return "success";
      })
      .catch( (error) => {console.log(error); return "error"} );
}

async function updatePendingState(isAccepted, expenseId) {
    //if (!authenticateToken) maybe later
  const data = {
    accepted: isAccepted,
    expense_id : expenseId
  };
  const JSONdata = JSON.stringify(data);
  const endpoint = '/api/pending'

  // Form the request for sending data to the server.
  const options = {
    method: 'POST',
    mode : 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSONdata
  }
  return await fetch(endpoint, options).then( (response) => {
    if (response.status == 400) {
      alert("Unable to find form fields");
      return "error";
    }
    return response.json();
    })
    .then( (result) => {
      if (!result.token_success) {
        return "token";
      }
      if (!result.handle_success) {
        return "invalid";
      }
        return "success";
    })
    .catch( (error) => {console.log(error); return "error"} );
}

async function payDebt(id, expenseId, amount) {
  //if (!authenticateToken) maybe later
  const data = {
    email: id,
    amount : amount,
    expense_id : expenseId
  };
  const JSONdata = JSON.stringify(data);
  const endpoint = '/api/fulfill_expense'

  // Form the request for sending data to the server.
  const options = {
    method: 'POST',
    mode : 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSONdata
  }

  return await fetch(endpoint, options).then( (response) => {
    if (response.status == 400) {
      alert("Unable to find form fields");
      return "error";
    }
    return response.json();
    })
    .then( (result) => {
      if (!result.token_success) {
        return "token";
      }
      //temp name
      if (!result.pay_success) {
        return "invalid";
      }
        return "success";
    })
    .catch( (error) => {console.log(error); return "error"} );
}

async function getGroup(groupId, email) {
  const data = {
    group_id : groupId,
    email : email
  };
  const JSONdata = JSON.stringify(data);
  const endpoint = '/api/get_group'

  // Form the request for sending data to the server.
  const options = {
    method: 'POST',
    mode : 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSONdata
  }

  return await fetch(endpoint, options).then( (response) => {
    if (response.status == 400) {
      alert("Unable to find form fields");
      return "error";
    }
    console.log(response);
    return response.json();
    })
    .then( (result) => {
      if (!result.token_success) {
        return "token";
      }
      //temp name
      if (!result.get_success) {
        return "invalid";
      }
        return "success";
    })
    .catch( (error) => {console.log(error); return "error"} );
}

//server side function only
async function addUserToGroup(email, groupId) {
  if (typeof window === "undefined") {
    const data = {
      email : email,
      uuid : groupId
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = 'https://cxt3kig2ocrigm3mvzm7ql3m6u0plfwd.lambda-url.us-east-2.on.aws/'
  
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
          return "error";
        }
      return response.json();
      })
      .then( (result) => {
        if (result.ERROR == "No such group") {
          return "error";
        }
        if (!result.token_success) {
          return "token";
        }
        if (!result.group_add_success) {
          return "invalid";
        }
          return "success";
      })
      .catch( (error) => {console.log(error); return "error"} );
  } else {
    return "error";
  }
}

//user function only
async function deleteGroup(groupId) {
  const data = {
    group_id : groupId
  };
  const JSONdata = JSON.stringify(data);
  const endpoint = '/api/delete_group'

  // Form the request for sending data to the server.
  const options = {
    method: 'POST',
    mode : 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSONdata
  }

  return await fetch(endpoint, options).then( (response) => {
    if (response.status == 400) {
      alert("Unable to find form fields");
      return "error";
    }
    return response.json();
    })
    .then( (result) => {
      if (!result.token_success) {
        return "token";
      }
      //temp name
      if (!result.delete_success) {
        return "invalid";
      }
        return "success";
    })
    .catch( (error) => {console.log(error); return "error"} );
}