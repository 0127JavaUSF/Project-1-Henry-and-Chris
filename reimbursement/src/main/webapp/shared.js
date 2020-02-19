
//converts the typeId to a string
function getReimbursementType(typeId) {

    let types = getReimbursementTypes();

    return types[typeId - 1];
}

function getReimbursementTypes() {

    return [ "Lodging", "Travel", "Food", "Other" ];
}

//converts the typeId to a string
function getStatus(statusId) {

    switch (statusId) {
        case 1: return "Pending";
        case 2: return "Approved";
        case 3: return "Denied";
    }

    return "Unknown";
}

//postParams should be an object literal
async function postRequest(postParams, url, callback) {
	try {
		const config = {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(postParams)
		}

        const response = await fetch(url, config);
        
        //if error
        if(response.status >= 400) {

            let errorMessage;
            switch(response.status) {
                case 401: errorMessage = "Unauthorized Error"; break;
                case 500: errorMessage = "Server Error"; break;
                case 503: errorMessage = "Database Connection Error"; break;
                default: errorMessage = "Error";
            }

            callback({}, errorMessage);
            return;
        }

        let json = await response.json()
        
        callback(json, "");
	}
	catch (error) {

        callback({}, "Error");
	}
}

//set the table cell
//tr is <tr> element. data is cell data
function setTableCell(tr, data) {

    let td = document.createElement("td");
    tr.appendChild(td);
    td.innerText = data;
}