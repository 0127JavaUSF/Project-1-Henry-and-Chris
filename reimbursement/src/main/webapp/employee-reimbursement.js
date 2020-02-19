
function addAmountListener() {

    let amount = document.getElementById("amount_text");
    amount.addEventListener('blur', ()=> {

        //if not a number (invalid input)
        const amountFloat = Number.parseFloat(amount.value);
        if(Number.isNaN(amountFloat)) {
            amount.value = 0; //change to 0
        }

        const amountInDollars = formatCurrency(amount.value);

        amount.value = amountInDollars;
    });
}

function addNewTicketListener() {

    let button = document.getElementById("new_ticket_button");
    button.addEventListener('click', () => {

        let form = document.getElementById("new_ticket_form");

        if (form.style.display === "none") {
            form.style.display = "block";
        }
        //do not toggle
        // else {
        //     form.style.display = "none";
        // }
    });
}

function addSubmitTicketListener() {

    let button = document.getElementById("submit");
    button.addEventListener('click', (e) => {

        let isValid = validateNewTicketForm();

        e.preventDefault();
    }); 
}

function fillTicketTable() {

    //todo: get from server

    //pretend this is the JSON response
    let response = [
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

    let body = document.getElementById("ticket_body");

    for (let ticket of response) {

        let tr = document.createElement("tr");
        body.appendChild(tr);

        setTableCell(tr, ticket.id);
        setTableCell(tr, ticket.submitted);
        setTableCell(tr, getReimbursementType(ticket.typeId));
        setTableCell(tr, ticket.amount);
        setTableCell(tr, ticket.description);
        setTableCell(tr, getStatus(ticket.statusId));
        setTableCell(tr, ticket.resolved);
    }
}

function fillTypeSelect() {
    
    let select = document.getElementById("type_select");
    
    let types = getReimbursementTypes();

    for(let i = 0; i <= types.length; i++) {

        let option = document.createElement("option");
        option.value = i; //this is the typeId

        if(i === 0) {
            option.innerText = ""; //make first option empty
        }
        else {
            option.innerText = types[i];
        }

        select.appendChild(option);
    }
}

//returns a string in format $X.XX
function formatCurrency(amount) {

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      })

      return formatter.format(amount);
}

function validateNewTicketForm() {

    let isValid = true;

    let amount = document.getElementById("amount_text");
    let amountRequired = document.getElementById("amount_required");

    let noDollarSign = amount.value.replace('$', ''); //remove dollar sign
    let amountNumber = Number.parseFloat(noDollarSign);

    //if amount is invalid
    if(!amountNumber || Number.isNaN(amountNumber) || amountNumber === 0) {
        isValid = false;
        amountRequired.classList.remove("hide");
    }
    else {
        amountRequired.classList.add("hide");
    }

    let type = document.getElementById("type_select");
    let typeRequired = document.getElementById("select_required");
    if(type.value == 0) { //if type not selected
        isValid = false;
        typeRequired.classList.remove("hide");
    }
    else {
        typeRequired.classList.add("hide");
    }

    let description = document.getElementById("description_textarea");
    let descriptionRequired = document.getElementById("description_required");
    if(!description.value) { //if type not selected
        isValid = false;
        descriptionRequired.classList.remove("hide");
    }
    else {
        descriptionRequired.classList.add("hide");
    }

    return isValid;
}

document.addEventListener("DOMContentLoaded", function () {

    fillTicketTable();

    addNewTicketListener();

    addAmountListener();

    fillTypeSelect();

    addSubmitTicketListener();
});