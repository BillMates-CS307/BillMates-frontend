export const shopping_methods = {
    addItem,
    removeItem,
    createList,
    updateActiveStatus,
    fetchListData,
    fetchAllListData
};


async function addItem(itemName, groupId, listId) {
    let response_body = {
        success : false,
        errorType : 0,
        errorMessage : ""
    }

    const request_body = JSON.stringify({
        "name" : itemName,
        "group_id" : groupId,
        "list_id" : listId
    });

    const options = {
        method: 'POST',
        mode : 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: request_body
    }

    return await fetch("/api/shopping_add_item", options).then( (response) => {
        if (response.status == 400 || response.status == 500 || response.status == 502) {
            response_body.errorType = response.status;
            response_body.errorMessage = "Could not service this request right now.\nPlease try again later";
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) { //Lambda response doesn't have this field
            return result;
        } else if (!result.add_succes) { //list is finalized
            response_body.errorType = 1;
            response_body.errorMessage = "This list has been finalized";
            return response_body;
        }
        response_body.success = true;
        return response_body;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = 2;
        response_body.errorMessage = "Internal parsing error";
        return response_body;
    });

}

async function removeItem(itemId, groupId, listId) {
    let response_body = {
        success : false,
        errorType : 0,
        errorMessage : ""
    }

    const request_body = JSON.stringify({
        "item_id" : itemId,
        "group_id" : groupId,
        "list_id" : listId
    });

    const options = {
        method: 'POST',
        mode : 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: request_body
    }

    return await fetch("/api/shopping_remove_item", options).then( (response) => {
        if (response.status == 400 || response.status == 500 || response.status == 502) {
            response_body.errorType = response.status;
            response_body.errorMessage = "Could not service this request right now.\nPlease try again later";
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) { //Lambda response doesn't have this field
            return result;
        } else if (!result.remove_success) { //list is finalized
            response_body.errorType = 1;
            response_body.errorMessage = "This list has been finalized";
            return response_body;
        }
        response_body.success = true;
        return response_body;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = 2;
        response_body.errorMessage = "Internal parsing error";
        return response_body;
    });
}

async function createList(name, groupId) {
    let response_body = {
        success : false,
        errorType : 0,
        errorMessage : "",
        listId : null
    }

    const request_body = JSON.stringify({
        "name" : name,
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

    return await fetch("/api/shopping_create_list", options).then( (response) => {
        if (response.status == 400 || response.status == 500 || response.status == 502) {
            response_body.errorMessage = "Could not service this request right now.\nPlease try again later";
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) { //Lambda response doesn't have this field
            return result;
        } else if (!result.create_success) { //list with same name??? idk what would cause this besides an error
            response_body.errorType = 1;
            response_body.errorMessage = "This list already exists";
            return response_body;
        }
        response_body.success = true;
        response_body.listId = result._id;
        return response_body;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = 2;
        response_body.errorMessage = "Internal parsing error";
        return response_body;
    });
}

async function updateActiveStatus(listId, groupId, isActive) {
    let response_body = {
        success : false,
        errorType : 0,
        errorMessage : "",
    }

    const request_body = JSON.stringify({
        "active" : isActive,
        "group_id" : groupId,
        "list_id" : listId
    });

    const options = {
        method: 'POST',
        mode : 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: request_body
    }

    return await fetch("/api/shopping_update_list_status", options).then( (response) => {
        if (response.status == 400 || response.status == 500 || response.status == 502) {
            response_body.errorMessage = "Could not service this request right now.\nPlease try again later";
            return response_body;
        }
        return response.json();
    }).then((result) => {
        if (result.errorType) { //Lambda response doesn't have this field
            return result;
        } else if (!result.update_success) { //idk what would cause this besides an error
            response_body.errorType = 1;
            response_body.errorMessage = "Already in a different status";
            return response_body;
        }
        response_body.success = true;
        return response_body;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = 2;
        response_body.errorMessage = "Internal parsing error";
        return response_body;
    });
}

async function fetchListData(groupId, listId) {
    let response_body = {
        success : false,
        errorType : 0,
        errorMessage : "",
        data : null
    }

    const request_body = JSON.stringify({
        "group_id" : groupId,
        "list_id" : listId
    });

    const options = {
        method: 'POST',
        mode : 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: request_body
    }

    return await fetch("/api/shopping_fetch_data_single", options).then( (response) => {
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
            response_body.errorMessage = "Already in a different status";
            return response_body;
        }
        response_body.success = true;
        response_body.data = result;
        return response_body;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = 2;
        response_body.errorMessage = "Internal parsing error";
        return response_body;
    });
}

async function fetchAllListData(groupId) {
    let response_body = {
        success : false,
        errorType : 0,
        errorMessage : "",
        data : null
    }

    const request_body = JSON.stringify({
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

    return await fetch("/api/shopping_fetch_data_all", options).then( (response) => {
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
            response_body.errorMessage = "Ya idk how you managed this";
            return response_body;
        }
        response_body.success = true;
        response_body.data = result;
        return response_body;
    }).catch( (error) => {
        console.log(error);
        response_body.errorType = 2;
        response_body.errorMessage = "Internal parsing error";
        return response_body;
    });
}
