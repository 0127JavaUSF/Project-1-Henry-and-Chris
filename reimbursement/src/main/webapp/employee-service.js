
class EmployeeService {

    constructor() {
        this.lastUsername = "";
        this.tickets = [];
        this.ticketRowTotal = 0;
    }

    addAmountListener() {

        const amount = document.getElementById("amount_text");
        amount.addEventListener('blur', () => {

            //if not a number (invalid input)
            const amountFloat = Number.parseFloat(amount.value);
            if (Number.isNaN(amountFloat)) {
                amount.value = 0; //change to 0
            }

            const amountInDollars = shared.formatCurrency(amount.value);

            amount.value = amountInDollars;

            this.validateAmount();
        });
    }

    addClearReceiptListener() {

        const button = document.getElementById("clear_receipt_button");
        button.addEventListener('click', () => {

            //clear selected receipt file
            const filePicker = document.getElementById("receipt_file");
            filePicker.value = "";
        });
    }

    addTypeListener() {

        const type = document.getElementById("type_select");
        type.addEventListener('change', () => {

            this.validateType();
        });
    }

    addDescriptionListener() {

        const description = document.getElementById("description_textarea");
        description.addEventListener('blur', () => {

            this.validateDescription();
        });
    }

    addNewTicketListener() {

        const button = document.getElementById("new_ticket_button");
        button.addEventListener('click', () => {

            const form = document.getElementById("new_ticket_form");

            if (form.style.display === "none") {
                form.style.display = "block";
                
                button.disabled = true;

                this.clearNewTicketForm();
            }
            // else {
            //     //do not toggle
            //     form.style.display = "none";
            // }
        });
    }

    addSubmitTicketListener() {

        const button = document.getElementById("submit");
        button.addEventListener('click', (e) => {

            const isValid = this.validateNewTicketForm();
            if(isValid) {

                const typeId_ = document.getElementById("type_select").value;

                const params = {
                    amount: this.getNewTicketAmount(),
                    description: document.getElementById("description_textarea").value,
                    typeId: typeId_
                };

                const receiptElement = document.getElementById("receipt_file");
                const files = receiptElement.files;

                if(files.length > 0) {
                    shared.postRequestMultiPart(params, files[0], "http://localhost:8080/reimbursement/insert-multipart", (json, statusCode, errorMessage)=> {

                        this.onSubmitTicket(errorMessage, json);
                    });
                }
                else {
                    shared.postRequest(params, "http://localhost:8080/reimbursement/insert", (json, statusCode, errorMessage)=> {

                        this.onSubmitTicket(errorMessage, json);
                    });
                }
            }

            e.preventDefault();
        });
    }

    clearNewTicketForm() {

        document.getElementById("amount_text").value = "";
        shared.addClass("amount_required", "hide");

        document.getElementById("type_select").value = 0;
        shared.addClass("select_required", "hide");

        document.getElementById("description_textarea").value = "";
        shared.addClass("description_required", "hide");
            
        document.getElementById("receipt_file").value = "";
    }

    onSubmitTicket(errorMessage, ticket) {

        if (errorMessage) {

            const error = document.getElementById("submit_error");
            error.innerText = errorMessage;
            error.classList.remove("hide");
        }
        else {
            shared.addClass("submit_error", "hide");

            //update ticket table
            this.tickets.push(ticket);
            this.addRowToTicketTable(ticket);

            //clear form
            this.clearNewTicketForm();

            //close the section
            document.getElementById("new_ticket_form").style.display = "none";

            //enable new ticket button
            const button = document.getElementById("new_ticket_button");
            button.disabled = false;
        }
    }

    fillTicketTable() {

        //if same user (we already have tickets)
        if(this.lastUsername === shared.user.username) {
            return;
        }
        this.lastUsername = shared.user.username;

        //clear table
        const ticketBody = document.getElementById("ticket_body");
        ticketBody.innerHTML = "";
        this.ticketRowTotal = 0;

        //get user tickets
        shared.postRequest( {}, "http://localhost:8080/reimbursement/get-user-reimb", (json, statusCode, errorMessage)=> {

            if(!errorMessage) {

                this.tickets = json;

                for (let ticket of this.tickets) {

                    this.addRowToTicketTable(ticket);
                }
            }
        });
    }

    addRowToTicketTable(ticket) {

        const body = document.getElementById("ticket_body");

        let tr = document.createElement("tr");
        body.appendChild(tr);

        //these attributes make the row clickable
        tr.classList.add("clickable_tr");
        tr.setAttribute("data-toggle", "collapse");
        tr.setAttribute("data-target", "#collaspe_div" + this.ticketRowTotal);            

        shared.setTableCell(tr, ticket.id);
        shared.setTableCell(tr, ticket.submittedString);
        shared.setTableCell(tr, TYPES[ticket.typeId]);
        shared.setTableCell(tr, shared.formatCurrency(ticket.amount));
        shared.setTableCell(tr, STATUSES[ticket.statusId]);
        shared.setTableCell(tr, ticket.resolved);

        //this row is collapsable. it contains the description and receipt
        tr = document.createElement("tr");
        body.appendChild(tr);

        const td = document.createElement("td");
        tr.appendChild(td);
        td.setAttribute("colspan", "7");
        td.style.width = "100%";

        //collapsable div
        const div = document.createElement("div");
        td.appendChild(div);       
        div.id = "collaspe_div" + this.ticketRowTotal;
        div.classList.add("collapse");

        //Description heading
        const h4 = document.createElement("h4");
        div.appendChild(h4);
        h4.innerText = "Description:";

        //Description text
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

            //resize it to 20% of the width of the window
            const origWidth = this.width;
            const newWidth = window.innerWidth * .2;
            const percent = newWidth / origWidth;
            
            this.width *= percent;
            this.height *= percent;
        });

        this.ticketRowTotal++;
    }

    getNewTicketAmount() {
        const amount = document.getElementById("amount_text");
        const amountRequired = document.getElementById("amount_required");

        const noDollarSign = amount.value.replace('$', ''); //remove dollar sign
        const amountNumber = Number.parseFloat(noDollarSign);

        return amountNumber;
    }

    showSection() {

        //close other sections
        shared.closeSections();

        //open these 2 sections
        const ticketsSection = document.getElementById("my_tickets_section");
        ticketsSection.style.display = "block";

        const newTicketSection = document.getElementById("new_ticket_section");
        newTicketSection.style.display = "block";

        //update nav bar

        shared.setManageNavBarDisplay();

        shared.setNavBar(NAV_MY_TICKETS, true, true);
        shared.setNavBar(NAV_MANAGE_TICKETS, false, false);
        shared.setNavBar(NAV_LOG_OUT, false, false);

        this.fillTicketTable();
    }

    validateAmount() {
        const amount = document.getElementById("amount_text");
        const amountRequired = document.getElementById("amount_required");

        const noDollarSign = amount.value.replace('$', ''); //remove dollar sign
        const amountNumber = Number.parseFloat(noDollarSign);

        //if amount is invalid
        let isValid = true;
        if (!amountNumber || Number.isNaN(amountNumber) || amountNumber === 0) {
            isValid = false;
            amountRequired.classList.remove("hide");
        }
        else {
            amountRequired.classList.add("hide");
        }

        return isValid;
    }

    validateType() {

        const type = document.getElementById("type_select");
        const typeRequired = document.getElementById("select_required");
        let isValid = true;
        if (type.value == 0) { //if type not selected
            isValid = false;
            typeRequired.classList.remove("hide");
        }
        else {
            typeRequired.classList.add("hide");
        }
        return isValid;
    }

    validateDescription() {
        const description = document.getElementById("description_textarea");
        const descriptionRequired = document.getElementById("description_required");
        let isValid = true;
        if (!description.value) { //if type not selected
            isValid = false;
            descriptionRequired.classList.remove("hide");
        }
        else {
            descriptionRequired.classList.add("hide");
        }
        return isValid;
    }

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