
//constants

//these are used by the nav bar
const NAV_MY_TICKETS = 0;
const NAV_MANAGE_TICKETS = 1;
const NAV_LOG_OUT = 2;
const NAV_LI = ["my_tickets_li", "manage_tickets_li", "log_out_li"]; //<li> tag ids
const NAV_A = ["my_tickets_a", "manage_tickets_a", "log_out_a"]; //<a> tag ids

const ROLE_EMPLOYEE = 1;
const ROLE_MANAGER = 2;
const ROLES = ["", "Employee", "Manager"]; //first index is empty because constants need to match Java and SQL (start at 1)

const STATUS_PENDING = 1;
const STATUS_APPROVED = 2;
const STATUS_DENIED = 3;
const STATUSES = ["", "Pending", "Approved", "Denied"];

const TYPE_LODGING = 1;
const TYPE_TRAVEL = 2;
const TYPE_FOOD = 3;
const TYPE_OTHER = 4;
const TYPES = ["", "Lodging", "Travel", "Food", "Other"];

class Shared {

    constructor() {
        this.user = null;
    }

    clearData() {
        this.user = null;
    }

    addClass(elementId, className) {
        const element = document.getElementById(elementId);
        if(element.classList.contains(className) === false) {
            element.classList.add(className);
        }
    }

    removeClass(elementId, className) {
        document.getElementById(elementId).classList.remove(className);
    }

    addNavBarClickListeners() {

        const myTickets = document.getElementById(NAV_A[NAV_MY_TICKETS]);
        myTickets.addEventListener("click", (e)=> {

            employeeService.showSection();

            e.preventDefault();
        });

        const manageTickets = document.getElementById(NAV_A[NAV_MANAGE_TICKETS]);
        manageTickets.addEventListener("click", (e)=> {

            managerService.showSection();

            e.preventDefault();
        });
    
        const logout = document.getElementById(NAV_A[NAV_LOG_OUT]);
        logout.addEventListener("click", (e)=> {

            loginService.showSection();

            e.preventDefault();
        });
    }

    closeSections() {

        const logInSection = document.getElementById("login_section");
        logInSection.style.display = "none";

        const ticketsSection = document.getElementById("my_tickets_section");
        ticketsSection.style.display = "none";

        const newTicketSection = document.getElementById("new_ticket_section");
        newTicketSection.style.display = "none";

        const managerSection = document.getElementById("manager_section");
        managerSection.style.display = "none";
    }

    disableNavBar() {

        //for all nav bar menu items
        for(let i = 0; i < NAV_LI.length; i++) {

            //make not active
            this.removeClass(NAV_LI[i], "active");

            //make disabled
            this.addClass(NAV_A[i], "disabled");
        }
    }

    setManageNavBarDisplay() {

        const manageTickets = document.getElementById(NAV_LI[NAV_MANAGE_TICKETS]);
        if(this.user && this.user.roleId === ROLE_MANAGER) {

            manageTickets.style.display = "block";
        }
        else {
            //do not show manage tickets menu item
            manageTickets.style.display = "none";
        }
    }

    setNavBar(navIndex, isActive, isDisabled) {

        const menuItemLI = document.getElementById(NAV_LI[navIndex]);
        if(isActive) {
            //make active
            this.addClass(NAV_LI[navIndex], "active");
        }
        else {
            this.removeClass(NAV_LI[navIndex], "active");
        }
        
        const menuItemA = document.getElementById(NAV_A[navIndex]);
        if(isDisabled) {
            //make disabled
            this.addClass(NAV_A[navIndex], "disabled");
        }
        else {
            //remove disabled
            this.removeClass(NAV_A[navIndex], "disabled");
        }
    }

    fillStatusSelect(tagId) {

        const select = document.getElementById(tagId);

        for (let i = 0; i < STATUSES.length; i++) {

            const option = document.createElement("option");
            option.value = i; //this is the typeId

            if (i === 0) {
                option.innerText = "None"; //make first option empty
            }
            else {
                option.innerText = STATUSES[i];
            }

            select.appendChild(option);
        }
    }

    fillTypeSelect(tagId) {

        const select = document.getElementById(tagId);

        for (let i = 0; i < TYPES.length; i++) {

            const option = document.createElement("option");
            option.value = i; //this is the typeId

            if (i === 0) {
                option.innerText = "None"; //make first option empty
            }
            else {
                option.innerText = TYPES[i];
            }

            select.appendChild(option);
        }
    }

    //returns a string in format $X.XX
    formatCurrency(amount) {

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })

        return formatter.format(amount);
    }

    async getRequest(getParams, url, callback) {

        //todo: concat getParams to end of url
        //currently we do not need this functionality

        try {
            const config = {
                method: 'GET',
            }

            const response = await fetch(url, config);

            //if error
            if (response.status >= 400) {

                let errorMessage = this.postError(response.status);

                callback({}, response.status, errorMessage);
                return;
            }

            const json = await response.json();

            callback(json, response.status, "");
        }
        catch (error) {

            callback({}, 404, "Error");
        }
    }

    //postParams should be an object literal
    async postRequest(postParams, url, callback, methodType = 'POST') {
        try {
            //encode post params
            let formBody = [];
            for (let property in postParams) {
              const encodedKey = encodeURIComponent(property);
              const encodedValue = encodeURIComponent(postParams[property]);
              formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            const config = {
                method: methodType,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: formBody
            }

            const response = await fetch(url, config);

            //if error
            if (response.status >= 400) {

                let errorMessage = this.responseError(response.status);

                callback({}, response.status, errorMessage);
                return;
            }

            const json = await response.json();

            callback(json, response.status, "");
        }
        catch (error) {

            callback({}, 404, "Error");
        }
    }

        //postParams should be an object literal
    //this works with file upload (such as receipt)
    async postRequestMultiPart(postParams, file, url, callback) {
        try {
            //append file
            const data = new FormData();
            data.append('file', file);

            //append post params
            for (let property in postParams) {

                data.append(property, postParams[property]);
            }

            const config = {
                method: 'POST',
                body: data
            }

            const response = await fetch(url, config);

            //if error
            if (response.status >= 400) {

                const test = await response.text();

                let errorMessage = this.responseError(response.status);

                callback({}, response.status, errorMessage);
                return;
            }

            const json = await response.json()

            callback(json, response.status, "");
        }
        catch (error) {

            callback({}, 404, "Error");
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

                let errorMessage = this.responseError(response.status);

                callback({}, response.status, errorMessage);
                return;
            }

            const json = await response.json()

            callback(json, 200, "");
        }
        catch (error) {

            callback({}, 404, "Error");
        }
    }
    
    async putRequest(file, contentType, url) {
        try{
            const config = {
                method: 'PUT',
                header: {
                    'Content-Type': contentType,
                },
                body: file
        }

       const response = await fetch(url, config);
       console.log(response.status);

    }
    catch (error){
        console.log(error);
    }
}

    responseError(responseStatus) {

        switch (responseStatus) {
            case 401: return "Unauthorized Error";
            case 403: return "Forbidden Error";
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
}
const shared = new Shared();

document.addEventListener("DOMContentLoaded", function () {

    shared.addNavBarClickListeners();

    if(typeof loginService !== "undefined") {

        loginService.addLoginEventListener();
    }

    if(typeof employeeService !== "undefined") {

        employeeService.addNewTicketListener();
    
        employeeService.addAmountListener();

        employeeService.addTypeListener();

        employeeService.addDescriptionListener();
    
        shared.fillTypeSelect("type_select");

        employeeService.addClearReceiptListener();

        employeeService.addSubmitTicketListener();    
    }

    if(typeof managerService !== "undefined") {
   
        //add options to select
        shared.fillStatusSelect("filter_status_select");

        //add event listener to select
        managerService.addFilterListener();
    }
});