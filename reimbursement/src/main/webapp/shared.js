
//converts the typeId to a string
function getReimbursementType(typeId) {

    let types = getReimbursementTypes();

    return types[typeId - 1];
}

function getReimbursementTypes() {

    return [ "Lodging", "Travel", "Food", "Other" ];
}

//converts the typeId to a string
function getStatus(statusId) {

    switch (statusId) {
        case 1: return "Pending";
        case 2: return "Approved";
        case 3: return "Denied";
    }

    return "Unknown";
}

//set the table cell
//tr is <tr> element. data is cell data
function setTableCell(tr, data) {

    let td = document.createElement("td");
    tr.appendChild(td);
    td.innerText = data;
}