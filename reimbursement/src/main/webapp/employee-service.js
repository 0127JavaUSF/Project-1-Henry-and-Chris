
class EmployeeService {

    addAmountListener() {

        const amount = document.getElementById("amount_text");
        amount.addEventListener('blur', () => {

            //if not a number (invalid input)
            const amountFloat = Number.parseFloat(amount.value);
            if (Number.isNaN(amountFloat)) {
                amount.value = 0; //change to 0
            }

            const amountInDollars = this.formatCurrency(amount.value);

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

            e.preventDefault();
        });
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
                typeId: 3
            }
        ];

        const body = document.getElementById("ticket_body");

        let i = 0;
        for (let ticket of response) {

            let tr = document.createElement("tr");
            body.appendChild(tr);

            //these attributes make the row clickable
            tr.classList.add("clickable_tr");
            tr.setAttribute("data-toggle", "collapse");
            tr.setAttribute("data-target", "#collaspe_div" + i);            

            shared.setTableCell(tr, ticket.id);
            shared.setTableCell(tr, ticket.submitted);
            shared.setTableCell(tr, TYPES[ticket.typeId]);
            shared.setTableCell(tr, ticket.amount);
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
            div.id = "collaspe_div" + i;
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

            i++;
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
        const amountNumber = Number.parseFloat(noDollarSign);

        //if amount is invalid
        if (!amountNumber || Number.isNaN(amountNumber) || amountNumber === 0) {
            isValid = false;
            amountRequired.classList.remove("hide");
        }
        else {
            amountRequired.classList.add("hide");
        }

        const type = document.getElementById("type_select");
        const typeRequired = document.getElementById("select_required");
        if (type.value == 0) { //if type not selected
            isValid = false;
            typeRequired.classList.remove("hide");
        }
        else {
            typeRequired.classList.add("hide");
        }

        const description = document.getElementById("description_textarea");
        const descriptionRequired = document.getElementById("description_required");
        if (!description.value) { //if type not selected
            isValid = false;
            descriptionRequired.classList.remove("hide");
        }
        else {
            descriptionRequired.classList.add("hide");
        }

        return isValid;
    }
}
const employeeService = new EmployeeService();