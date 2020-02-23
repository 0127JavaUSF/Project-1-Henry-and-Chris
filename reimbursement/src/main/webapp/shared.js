
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
            document.getElementById(NAV_LI[i]).classList.remove("active");

            //make disabled
            const myTicketsA = document.getElementById(NAV_A[i]);
            if(myTicketsA.classList.contains("disabled") === false) {
                myTicketsA.classList.add("disabled");
            }
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
            if(menuItemLI.classList.contains("active") === false) {
                menuItemLI.classList.add("active");
            }
        }
        else {
            menuItemLI.classList.remove("active");
        }
        
        const menuItemA = document.getElementById(NAV_A[navIndex]);
        if(isDisabled) {
            //make active
            if(menuItemA.classList.contains("disabled") === false) {
                menuItemA.classList.add("disabled");
            }
        }
        else {
            //remove disabled
            menuItemA.classList.remove("disabled");
        }
    }

    fillStatusSelect(tagId) {

        const select = document.getElementById(tagId);

        for (let i = 0; i <= STATUSES.length; i++) {

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

        for (let i = 0; i <= TYPES.length; i++) {

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

    //postParams should be an object literal
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
                    //'Accept': 'application/json',
                    //'Content-Type': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                //body: JSON.stringify(postParams)
                body: formBody
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

    shared.addNavBarClickListeners();

    if(typeof loginService !== "undefined") {

        loginService.addLoginEventListener();
    }

    if(typeof employeeService !== "undefined") {

        employeeService.fillTicketTable();

        employeeService.addNewTicketListener();
    
        employeeService.addAmountListener();
    
        shared.fillTypeSelect("type_select");
    
        employeeService.addSubmitTicketListener();    
    }

    if(typeof managerService !== "undefined") {
        
        managerService.fillManageTicketTable();

        shared.fillStatusSelect("filter_status_select");
    }
});