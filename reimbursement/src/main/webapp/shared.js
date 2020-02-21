
class Shared {

    constructor() {
        this.user = null;
    }

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
    //this version works with Java response.GetParameter(). the content type is different
    async postRequest(postParams, url, callback) {
        try {
            //encode post params
            var formBody = [];
            for (var property in postParams) {
              var encodedKey = encodeURIComponent(property);
              var encodedValue = encodeURIComponent(postParams[property]);
              formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            const config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: formBody
            }

            const response = await fetch(url, config);

            //if error
            if (response.status >= 400) {

                let errorMessage = this.postError(response.status);

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

    //postParams should be an object literal
    //this version works with Jackson marshalling in Java
    async postRequestJSON(postParams, url, callback) {
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

                let errorMessage = this.postError(response.status);

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

    postError(responseStatus) {

        switch (responseStatus) {
            case 401: return "Unauthorized Error";
            case 500: return "Server Error";
            case 503: return "Database Connection Error";
            default: return "Error";
        }
    }

    //set the table cell
    //tr is <tr> element. data is cell data
    setTableCell(tr, data) {

        const td = document.createElement("td");
        tr.appendChild(td);
        td.innerText = data;
    }

    setTableImgCell(tr, imgUrl) {
        const td = document.createElement("td");
        const img = document.createElement("img");
        img.src = imgUrl;
        tr.appendChild(td);
        td.append(img);

        //td.append(<img src="https://my-project-1-bucket.s3.amazonaws.com/24"/>);
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