import { serverRuntimeConfig } from "@/next.config";


export const groupService = {
    payDebt,
    updatePendingState,
    submitExpense,
    getGroup
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

async function updatePendingState(expense, amount, isAccepted) {
    //if (!authenticateToken) maybe later
  const data = {
    isAccepted: isAccepted,
    amountPaying : amount,
    expense : expense
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
      //temp name
      if (!result.pending_success) {
        return "invalid";
      }
        return "success";
    })
    .catch( (error) => {console.log(error); return "error"} );
}

async function payDebt(id, amount, expense) {
  //if (!authenticateToken) maybe later
  const data = {
    userId: id,
    amountPaying : amount,
    expense : expense
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
      if (!result.pay_sucess) {
        return "invalid";
      }
        return "success";
    })
    .catch( (error) => {console.log(error); return "error"} );
}

//getServiceSideProps call only
async function getGroup(groupId, email) {
    if (typeof window === "undefined") {
        const body_json = {group_id: "my_uuid", email: "test@test.test"};
        const url = 'https://jujezuf56ybwzdn7edily3gu6a0dcdir.lambda-url.us-east-2.on.aws/';
        //const url = "aaaaa";
        const options = {
            method: 'POST',
            mode : 'cors',
            headers: {
            'Content-Type': 'application/json',
            'token' : 'zpdkwA.2_kLU@zg'
            },
            body: JSON.stringify(body_json),
        }

        return fetch(url, options).then( (response) => {
            return response.json()
        })
        .then( (data) => {
            return data;
        }).catch( (e) => {console.log(e); return null;} )
    } else {
        console.log("here");
        return null;
    }
}