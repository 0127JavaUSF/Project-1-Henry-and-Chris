
class EmployeeService {

    constructor() {
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
                    shared.postRequestMultiPart(params, files[0], "http://localhost:8080/reimbursement/insertMultiPart", (json, errorCode, errorMessage)=> {

                        this.onSubmitTicket(errorMessage, json);
                    });
                }
                else {
                    shared.postRequest(params, "http://localhost:8080/reimbursement/insert", (json, errorCode, errorMessage)=> {

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

        const type = document.getElementById("type_select").value = 0;
        shared.addClass("select_required", "hide");

        document.getElementById("description_textarea").value = "";
        shared.addClass("description_required", "hide");
            
        document.getElementById("receipt_file").value = "";
    }

    onSubmitTicket(errorMessage, ticket) {

        const error = document.getElementById("submit_error");
        if (errorMessage) {

            error.innerText = errorMessage;
            error.classList.remove("hide");
        }
        else {
            shared.addClass("submit_error", "hide");

            //update ticket table
            this.addRowToTicketTable(ticket);

            //clear form
            this.clearNewTicketForm();

            //close the section
            document.getElementById("new_ticket_form").style.display = "none";
        }
    }

    fillTicketTable() {

        //todo: get from server

        //pretend this is the JSON response
        const response = [
            {
                id: "1",
                amount: 200.00,
                submitted: "Today",
                resolved: "",
                description: "Plane ticket.",
                receipt: "https://my-project-1-bucket.s3.amazonaws.com/24",
                statusId: 1,

                typeId: 2
            },
            {
                id: "2",
                amount: 150.00,
                submitted: "Yesterday",
                resolved: "",
                description: "Company picnic.",
                statusId: 3,
                receipt: "https://my-project-1-bucket.s3.amazonaws.com/23",
                typeId: 3
            }
        ];

        for (let ticket of response) {

            this.addRowToTicketTable(ticket);
        }
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
        shared.setTableCell(tr, ticket.submitted);
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

        const receiptImg = document.createElement("img");
        div.appendChild(receiptImg);
        receiptImg.setAttribute("src", "/reimbursement/receipt.jpeg");
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
    }

    validateNewTicketForm() {

        let isValid = true;

        const amount = document.getElementById("amount_text");
        const amountRequired = document.getElementById("amount_required");

        const noDollarSign = amount.value.replace('$', ''); //remove dollar sign
        const amountNumber = this.getNewTicketAmount();

        //if amount is invalid
        if (!amountNumber || Number.isNaN(amountNumber) || amountNumber === 0) {
            isValid = false;
            shared.removeClass("amount_text", "hide");
        }
        else {
            shared.addClass("amount_text", "hide");
        }

        const type = document.getElementById("type_select");
        if (type.value == 0) { //if type not selected
            isValid = false;
            shared.removeClass("type_select", "hide");
        }
        else {
            shared.addClass("type_select", "hide");
        }

        const description = document.getElementById("description_textarea");
        if (!description.value) { //if description empty
            isValid = false;
            shared.removeClass("description_textarea", "hide");
        }
        else {
            shared.addClass("description_textarea", "hide");
        }

        return isValid;
    }
}
const employeeService = new EmployeeService();