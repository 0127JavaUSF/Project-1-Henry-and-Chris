
class Shared {

    fillStatusSelect(tagId) {

        const select = document.getElementById(tagId);

        const statuses = shared.getReimbursementStatuses();

        for (let i = 0; i <= statuses.length; i++) {

            const option = document.createElement("option");
            option.value = i; //this is the typeId

            if (i === 0) {
                option.innerText = "None"; //make first option empty
            }
            else {
                option.innerText = statuses[i - 1];
            }

            select.appendChild(option);
        }
    }

    fillTypeSelect(tagId) {

        const select = document.getElementById(tagId);

        const types = shared.getReimbursementTypes();

        for (let i = 0; i <= types.length; i++) {

            const option = document.createElement("option");
            option.value = i; //this is the typeId

            if (i === 0) {
                option.innerText = "None"; //make first option empty
            }
            else {
                option.innerText = types[i - 1];
            }

            select.appendChild(option);
        }
    }

    getReimbursementStatuses() {

        return ["Pending", "Approved", "Denied"];
    }

    //converts the typeId to a string
    getReimbursementType(typeId) {

        const types = this.getReimbursementTypes();

        return types[typeId - 1];
    }

    getReimbursementTypes() {

        return ["Lodging", "Travel", "Food", "Other"];
    }

    //converts the typeId to a string
    getStatus(statusId) {

        switch (statusId) {
            case 1: return "Pending";
            case 2: return "Approved";
            case 3: return "Denied";
        }

        return "Unknown";
    }

    //postParams should be an object literal
    async postRequest(postParams, url, callback) {
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
            if (response.status >= 400) {

                let errorMessage;
                switch (response.status) {
                    case 401: errorMessage = "Unauthorized Error"; break;
                    case 500: errorMessage = "Server Error"; break;
                    case 503: errorMessage = "Database Connection Error"; break;
                    default: errorMessage = "Error";
                }

                callback({}, errorMessage);
                return;
            }

            const json = await response.json()

            callback(json, "");
        }
        catch (error) {

            callback({}, "Error");
        }
    }

    //set the table cell
    //tr is <tr> element. data is cell data
    setTableCell(tr, data) {

        const td = document.createElement("td");
        tr.appendChild(td);
        td.innerText = data;
    }
}
const shared = new Shared();

document.addEventListener("DOMContentLoaded", function () {

    if(typeof login !== "undefined") {

        login.addLoginEventListener();
    }

    if(typeof employeeService !== "undefined") {

        employeeService.fillTicketTable();

        employeeService.addNewTicketListener();
    
        employeeService.addAmountListener();
    
        shared.fillTypeSelect("type_select");
    
        employeeService.addSubmitTicketListener();    
    }

    if(typeof managerService !== "undefined") {
        
        shared.fillStatusSelect("filter_status_select");
    }
});