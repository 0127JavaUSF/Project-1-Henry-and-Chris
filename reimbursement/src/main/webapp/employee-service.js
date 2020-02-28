
//NOTE: THIS FILE USES JQUERY AS A LEARNING EXPERIENCE

class EmployeeService {

    constructor() {
        this.lastUsername = ""; //the last username that was logged in
        this.tickets = []; //used by my tickets table
        this.ticketRowTotal = 0;
    }

    //new ticket "amount" text input
    addAmountListener() {

        $("#amount_text").blur(function(){
            //convert to float
            const amountFloat = employeeService.getNewTicketAmount();

            //format in US dollars
            const amountInDollars = shared.formatCurrency(amountFloat);

            this.value = amountInDollars;

            //show "required" message if amount is 0
            employeeService.validateAmount();
        });
    }

    //"clear receipt" button used when attaching receipt to new ticket
    addClearReceiptListener() {

        $("#clear_receipt_button").click(() => {

            //remove receipt
            $("#receipt_file").val("");
        });
    }

    //new ticket "type" select
    addTypeListener() {

        $("#type_select").change(() => {

            //show "required" message if "none" selected
            this.validateType();
        });
    }

    //new ticket "description" text area
    addDescriptionListener() {

        $("#description_textarea").blur(() => {

            //show "required" if empty
            this.validateDescription();
        });
    }

    //new ticket button listener
    addNewTicketListener() {

        $("#new_ticket_button").click(function() {

            const form = $("#new_ticket_form");

            //if form not displayed
            if (form.css("display") === "none") {
                form.css("display", "block"); //display
                
                this.disabled = true;

                //clear form
                employeeService.clearNewTicketForm();
            }
        });
    }

    //submit ticket button listener
    addSubmitTicketListener() {

        $("#submit").click((e) => {

            //validate form
            const isValid = this.validateNewTicketForm();
            if(isValid) { //if valid

                //get form fields
                const typeId_ = $("#type_select").val();

                const files = $("#receipt_file").prop('files');
                const hasReceipt_ = files.length > 0 ? "true" : ""; //this will be a string in Java

                //put in post params
                const params = {
                    amount: this.getNewTicketAmount(),
                    description: $("#description_textarea").val(),
                    hasReceipt: hasReceipt_, //simply let Java know we have a receipt so the presigned url will be returned
                    typeId: typeId_
                };

                //we are using presigned urls, so we no longer need to upload the receipt
                // if(files.length > 0) {
                //     shared.postRequestMultiPart(params, files[0], "http://localhost:8080/reimbursement/insert-multipart", (json, statusCode, errorMessage)=> {

                //         this.onSubmitTicket(errorMessage, json);
                //     });
                // }
                // else {
                    shared.postRequest(params, "http://localhost:8080/reimbursement/insert", (json, statusCode, errorMessage)=> {

                        this.onSubmitTicket(errorMessage, json);
                    });
                // }
            }

            e.preventDefault();
        });
    }

    //clear new ticket form
    clearNewTicketForm() {

        $("#amount_text").val("");
        shared.addClass("amount_required", "hide");

        $("#type_select").val(0);
        shared.addClass("select_required", "hide");

       $("#description_textarea").val("");
        shared.addClass("description_required", "hide");
            
        $("#receipt_file").val("");
    }

    //new ticket post request callback
    onSubmitTicket(errorMessage, ticket) {

        //if error
        if (errorMessage) {

            //display error
            const error = $("#submit_error");
            error.text(errorMessage);
            error.prop("classList").remove("hide");
        }
        else {
            shared.addClass("submit_error", "hide");

            //update ticket table
            this.tickets.push(ticket);
            this.addRowToTicketTable(ticket);

            //clear form
            this.clearNewTicketForm();

            //close the section
            $("#new_ticket_form").css("display", "none");

            //enable new ticket button
            $("#new_ticket_button").prop("disabled", false);
        }
    }

    //fill the "my tickets" table
    fillTicketTable() {

        //if user has not changed (we already have tickets)
        if(this.lastUsername === shared.user.username) {
            return;
        }
        this.lastUsername = shared.user.username;

        //clear table
        $("#ticket_body").html("");
        this.ticketRowTotal = 0;

        //get user tickets
        shared.postRequest( {}, "http://localhost:8080/reimbursement/get-user-reimb", (json, statusCode, errorMessage)=> {

            if(!errorMessage) {

                this.tickets = json;

                for (let ticket of this.tickets) {

                    //add row
                    this.addRowToTicketTable(ticket);
                }
            }
        });
    }

    //add row to "my tickets" table
    addRowToTicketTable(ticket) {

        const body = $("#ticket_body");

        let tr = document.createElement("tr");
        body.append(tr);

        //these attributes make the row clickable
        tr.classList.add("clickable_tr");
        tr.setAttribute("data-toggle", "collapse");
        tr.setAttribute("data-target", "#collaspe_div" + this.ticketRowTotal);            

        shared.setTableCell(tr, ticket.id);
        shared.setTableCell(tr, ticket.submittedString);
        shared.setTableCell(tr, TYPES[ticket.typeId]);
        shared.setTableCell(tr, shared.formatCurrency(ticket.amount));
        shared.setTableCell(tr, STATUSES[ticket.statusId]);
        shared.setTableCell(tr, ticket.resolvedString);

        //this row is collapsable. it contains the description and receipt
        tr = document.createElement("tr");
        body.append(tr);

        const td = document.createElement("td");
        tr.appendChild(td);
        td.setAttribute("colspan", "7");
        td.style.width = "100%";

        //collapsable div
        const div = document.createElement("div");
        td.appendChild(div);       
        div.id = "collaspe_div" + this.ticketRowTotal;
        div.classList.add("collapse");

        //description heading
        const h4 = document.createElement("h4");
        div.appendChild(h4);
        h4.innerText = "Description:";

        //description text
        const p = document.createElement("p");
        div.appendChild(p);
        p.innerText = ticket.description;

        const imgDiv = document.createElement("div");
        imgDiv.className = "text-center";
        div.appendChild(imgDiv);

        const receiptImg = document.createElement("img");
        imgDiv.appendChild(receiptImg);
        receiptImg.setAttribute("src", "/reimbursement/receipt.jpeg");
        //once receipts work, uncomment this code
        //receiptImg.setAttribute("src", ticket.receipt);
        receiptImg.setAttribute("alt", "attachment");

        //when image loads
        receiptImg.addEventListener("load", function() { //arrow function "this" is wrong context. we want the element

            //resize the receipt to 20% of the width of the window
            const origWidth = this.width;
            const newWidth = window.innerWidth * .2;
            const percent = newWidth / origWidth;
            
            this.width *= percent;
            this.height *= percent;
        });

        this.ticketRowTotal++;
    }

    //convert the new ticket amount to a Number
    getNewTicketAmount() {
        const noDollarSign = $("#amount_text").val().replace('$', '').replace(/,/g, ''); //remove dollar sign
        const amountNumber = Number.parseFloat(noDollarSign);

        if (Number.isNaN(amountNumber)) {
            return 0;
        }

        return amountNumber;
    }

    //show the employee section
    showSection() {

        //close other sections
        shared.closeSections();

        //show "my tickets" and "new ticket" section
        $("#my_tickets_section").css("display", "block");

        $("#new_ticket_section").css("display", "block");

        //update nav bar
        shared.setManageNavBarDisplay();

        shared.setNavBar(NAV_MY_TICKETS, true, true);
        shared.setNavBar(NAV_MANAGE_TICKETS, false, false);
        shared.setNavBar(NAV_LOG_OUT, false, false);

        //fill "my tickets" table
        this.fillTicketTable();
    }

    //validate the new ticket form amount
    validateAmount() {
        const amountRequired = $("#amount_required");

        const noDollarSign = $("#amount_text").val().replace('$', ''); //remove dollar sign
        const amountNumber = Number.parseFloat(noDollarSign); //convert to float

        //if amount is invalid
        let isValid = true;
        if (!amountNumber || Number.isNaN(amountNumber) || amountNumber === 0) {
            isValid = false;
            amountRequired.prop("classList").remove("hide"); //show "required" error
        }
        else {
            amountRequired.prop("classList").add("hide");
        }

        return isValid;
    }

    //validate the new ticket form type
    validateType() {

        const typeRequired = $("#select_required");
        let isValid = true;
        if ($("#type_select").val() == 0) { //if type not selected
            isValid = false;
            typeRequired.prop("classList").remove("hide"); //show "required"
        }
        else {
            typeRequired.prop("classList").add("hide");
        }
        return isValid;
    }

    //validate the new ticket form description
    validateDescription() {
        const descriptionRequired = $("#description_required");
        let isValid = true;
        if (!$("#description_textarea").val()) { //if type not selected
            isValid = false;
            descriptionRequired.prop("classList").remove("hide"); //show "required"
        }
        else {
            descriptionRequired.prop("classList").add("hide");
        }
        return isValid;
    }

    //validate the entire new ticket form
    validateNewTicketForm() {

        let isValid = this.validateAmount();

        if(!this.validateType()) {
            isValid = false;
        }

        if(!this.validateDescription()) {
            isValid = false;
        }

        return isValid;
    }
}
const employeeService = new EmployeeService();