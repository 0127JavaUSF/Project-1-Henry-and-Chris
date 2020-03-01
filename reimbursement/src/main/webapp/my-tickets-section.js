
//note: this file uses JQuery for learning purposes

class MyTicketsSection {

    constructor() {
        this.lastUsername = ""; //the last username that was logged in
        this.tickets = []; //used by my tickets table
        this.ticketRowTotal = 0;
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
        shared.getRequest( {}, "http://localhost:8080/reimbursement/get-user-reimb", (json, statusCode, errorMessage)=> {

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
    addRowToTicketTable(ticket, rowIndex = -1, tableRowElement = null, collapsedTableRowElement = null) {

        const body = $("#ticket_body");

        //if default parameter not set
        if(rowIndex < 0) {
            rowIndex = this.ticketRowTotal;
            this.ticketRowTotal++;
        }

        let tr;
        if(tableRowElement) { //if table row passed to function
            tr = tableRowElement;
        }
        else {
            tr = document.createElement("tr");
            tr.id = "my_tickets_row" + rowIndex;
            body.append(tr);
        }

        //these attributes make the row clickable
        tr.classList.add("clickable_tr");
        tr.setAttribute("data-toggle", "collapse");
        tr.setAttribute("data-target", "#collaspe_div" + rowIndex);            

        shared.setTableCell(tr, ticket.id);
        shared.setTableCell(tr, ticket.submittedString);
        shared.setTableCell(tr, TYPES[ticket.typeId]);
        shared.setTableCell(tr, shared.formatCurrency(ticket.amount));
        shared.setTableCell(tr, STATUSES[ticket.statusId]);
        shared.setTableCell(tr, ticket.resolvedString);

        //if collapsable row passed to function
        if(collapsedTableRowElement) {
            tr = collapsedTableRowElement;
        }
        else {
            //this row is collapsable. it contains the description and receipt
            tr = document.createElement("tr");
            tr.id = "my_tickets_subrow" + rowIndex;
            body.append(tr);
        }

        const td = document.createElement("td");
        tr.appendChild(td);
        td.setAttribute("colspan", "7");
        td.style.width = "100%";

        //collapsable div
        const div = document.createElement("div");
        td.appendChild(div);       
        div.id = "collaspe_div" + rowIndex;
        div.classList.add("collapse");

        //description heading
        const h4 = document.createElement("h4");
        div.appendChild(h4);
        h4.innerText = "Description:";

        //description text
        const p = document.createElement("p");
        div.appendChild(p);
        p.innerText = ticket.description;

        //if receipt
        if(ticket.receipt && ticket.receipt !== "") {

            const imgDiv = document.createElement("div");
            imgDiv.className = "text-center";
            div.appendChild(imgDiv);
    
            const receiptImg = document.createElement("img");
            imgDiv.appendChild(receiptImg);

            receiptImg.setAttribute("src", ticket.receipt);
            receiptImg.setAttribute("alt", "Receipt");

            //when image loads
            receiptImg.addEventListener("load", function() { //arrow function "this" is wrong context. we want the element

                //resize the receipt to 25% of the width of the window
                shared.resizeImg(this, .25);
            });
        }
    }

    //a new ticket was created
    onNewTicket(ticket) {

        this.tickets.push(ticket);

        //add new row to table
        this.addRowToTicketTable(ticket);
    }

    //a ticket was resolved
    onResolvedTicket(resolvedTicket) {

        //check if in table
        let rowI = -1;
        let i = 0;
        for(let ticket of this.tickets) {
            if(ticket.id === resolvedTicket.id) {
                rowI = i;
                break;
            }
            i++;
        }

        //not in table
        if(rowI < 0) {
            return;
        }

        this.tickets[rowI] = resolvedTicket;

        //clear table row
        const row = document.getElementById("my_tickets_row" + rowI);
        row.innerHTML = "";

        //clear collapsable table row
        const subrow = document.getElementById("my_tickets_subrow" + rowI);
        subrow.innerHTML = "";

        //replace table row with updated ticket
        this.addRowToTicketTable(resolvedTicket, rowI, row, subrow); 
    }

    //show the my tickets section
    showSection() {

        //close other sections
        shared.closeSections();

        //show "my tickets"
        $("#my_tickets_section").css("display", "block");

        //update nav bar
        navBar.setManageDisplay();

        navBar.setMenuItem(NAV_MY_TICKETS, true, true);
        navBar.setMenuItem(NAV_MANAGE_TICKETS, false, false);
        navBar.setMenuItem(NAV_LOG_OUT, false, false);

        //fill "my tickets" table
        this.fillTicketTable();
    }
}
const myTicketsSection = new MyTicketsSection();