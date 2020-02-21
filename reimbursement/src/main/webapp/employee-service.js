
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

        const body = document.getElementById("ticket_body");

        for (let ticket of response) {

            const tr = document.createElement("tr");
            body.appendChild(tr);

            shared.setTableCell(tr, ticket.id);
            shared.setTableCell(tr, ticket.submitted);
            shared.setTableCell(tr, shared.getReimbursementType(ticket.typeId));
            shared.setTableCell(tr, ticket.amount);
            shared.setTableCell(tr, ticket.description);
            shared.setTableCell(tr, shared.getStatus(ticket.statusId));
            shared.setTableImgCell(tr, ticket.receipt);
            shared.setTableCell(tr, ticket.resolved);
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