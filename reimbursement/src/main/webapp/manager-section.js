class ManagerSection {

    constructor() {
        this.lastUsername = "";
        this.ticketRowTotal = 0;
        this.tickets = [];
    }

    //the "filter by ticket status" select
    addFilterListener() {

        const filter = document.getElementById("filter_status_select");
        filter.addEventListener("change", function() {
        	
        	//"none" filter
        	if(this.value == 0) {
        		
                managerSection.fillManageTicketTable(managerSection.tickets, false);
                return;
        	}

            //sort by status
            let sorted = [];
            for(let ticket of managerSection.tickets) { //need to use managerSection not "this" (which is filter)

                //this.value is select status
                if(ticket.statusId == this.value) { //value is a string so use == not ===
                    sorted.push(ticket);
                }
            }

            //update manager ticket table
            managerSection.fillManageTicketTable(sorted, false);
        });
    }

    //do post request to get all tickets
    getAllTicketsRequest() {

        //if same user (we already have tickets)
        if(this.lastUsername === shared.user.username) {
            return;
        }
        this.lastUsername = shared.user.username;

        //get all tickets
        shared.getRequest( {}, "http://localhost:8080/reimbursement/get-all-reimb", (json, statusCode, errorMessage)=> {

            if(!errorMessage) {

                this.tickets = json;

                this.fillManageTicketTable(this.tickets);
            }
        });        
    }

    //fill the manage tickets table
    fillManageTicketTable(tickets, clearStatusSelect = true) {

        if(clearStatusSelect) {
            //clear type select (filter)
            document.getElementById("filter_status_select").value = 0;
        }

        //clear table
        const ticketBody = document.getElementById("manage_ticket_body");
        ticketBody.innerHTML = "";
        this.ticketRowTotal = 0;

        for (let ticket of tickets) {

            this.addRowToManageTable(ticket);
        }
    }

    //add row to the manage ticket table
    addRowToManageTable(ticket, rowIndex = -1, tableRowElement = null, collapsedTableRowElement = null) {

        const body = document.getElementById("manage_ticket_body");

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
            body.appendChild(tr);
    
            tr.classList.add("clickable_tr");
            tr.id = "manage_ticket_row" + rowIndex;
            tr.setAttribute("data-toggle", "collapse");
            tr.setAttribute("data-target", "#collaspe_div" + rowIndex);   
        }

        //set row
        shared.setTableCell(tr, ticket.id);
        shared.setTableCell(tr, ticket.submittedString);
        shared.setTableCell(tr, ticket.authorString);
        shared.setTableCell(tr, TYPES[ticket.typeId]);
        shared.setTableCell(tr, shared.formatCurrency(ticket.amount));
        shared.setTableCell(tr, STATUSES[ticket.statusId]);
        shared.setTableCell(tr, ticket.resolvedString);
        shared.setTableCell(tr, ticket.resolverString);

        //if collapsable row passed to function
        if(collapsedTableRowElement) {
            tr = collapsedTableRowElement;
        }
        else {
            tr = document.createElement("tr");
            tr.id = "manage_ticket_subrow" + rowIndex;
            body.appendChild(tr);    
        }

        const td = document.createElement("td");
        tr.appendChild(td);
        td.setAttribute("colspan", "8");
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

        const imgDiv = document.createElement("div");
        imgDiv.className = "text-center";
        div.appendChild(imgDiv);

        const receiptImg = document.createElement("img");
        imgDiv.appendChild(receiptImg);
        receiptImg.setAttribute("src", "https://my-project-1-bucket.s3.amazonaws.com/1");
        receiptImg.setAttribute("alt", "attachment");
        
        //if ticket status is PENDING
        if(ticket.statusId === STATUS_PENDING){

            const outer = document.createElement("div");
            outer.className = "text-center";
            div.appendChild(outer);

            //approve / deny post request error
            const error = document.createElement("div");
            error.className = "error my-2 hide";
            error.id = "resolve_reimb_error" + rowIndex;
            error.innerText = "error placeholder"
            outer.appendChild(error);

            const inner = document.createElement("div");
            inner.className = "btn-group w-50 my-2";
            outer.appendChild(inner);
            
            //approve button
            const approve = document.createElement("input");
            approve.type = "button";
            approve.className = "btn btn-success";
            approve.value = "Approve";
            inner.appendChild(approve);

            //pass custom data to approve button
            approve.dataset.errorId = error.id;
            approve.dataset.reimbId = ticket.id;
            approve.dataset.rowIndex = rowIndex;
            approve.dataset.statusId = STATUS_APPROVED;

            //deny button
            const deny = document.createElement("input");
            deny.type = "button";
            deny.className = "btn btn-danger";
            deny.value = "Deny";
            inner.appendChild(deny);

            deny.dataset.errorId = error.id;
            deny.dataset.reimbId = ticket.id;
            deny.dataset.rowIndex = rowIndex;
            deny.dataset.statusId = STATUS_DENIED;

            approve.addEventListener("click", function() {

                managerSection.approveDenyRequest(this);
            });

            deny.addEventListener("click", function() {

                managerSection.approveDenyRequest(this);
            });
        }

       // when image loads
        receiptImg.addEventListener("load", function() { //arrow function "this" is wrong context. we want the element

            //resize it to 20% of the width of the window
            const origWidth = this.width;
            const newWidth = window.innerWidth * .2;
            const percent = newWidth / origWidth;
            
            this.width *= percent;
            this.height *= percent;
        });
    }

    approveDenyRequest(button) {

        const postParams = {
            reimbId: button.dataset.reimbId,
            statusId: button.dataset.statusId
        };
        
        shared.putRequest(postParams, "http://localhost:8080/reimbursement/resolve-reimb", function(updatedTicket, statusCode, errorMessage) {

            //if post error
            if (errorMessage) {
                const error = document.getElementById(this.dataset.errorId);
                error.innerText = errorMessage;

                //show error message
                shared.removeClass(this.dataset.errorId, "hide");
            }
            else {
                shared.addClass(this.dataset.errorId, "hide");

                managerSection.onApproveDeny(this, updatedTicket);
            }
        }.bind(button)); //this is button
    }

    //on approve or deny post request callback
    //updated ticket is set by the server
    onApproveDeny(button, updatedTicket) {

        const rowI = button.dataset.rowIndex;

        //replace ticket with updated ticket
        managerSection.tickets[rowI] = updatedTicket;

        //clear table row
        const row = document.getElementById("manage_ticket_row" + rowI);
        row.innerHTML = "";

        //clear collapsable table row
        const subrow = document.getElementById("manage_ticket_subrow" + rowI);
        subrow.innerHTML = "";

        //replace table row with updated ticket
        managerSection.addRowToManageTable(updatedTicket, rowI, row, subrow);
    }

    //show the manager section
    showSection() {

        //close other section
        shared.closeSections();

        //show this section
        const managerSection = document.getElementById("manager_section");
        managerSection.style.display = "block";

        //update nav bar
        navBar.setManageDisplay();

        navBar.setMenuItem(NAV_MY_TICKETS, false, false);
        navBar.setMenuItem(NAV_MANAGE_TICKETS, true, true);
        navBar.setMenuItem(NAV_LOG_OUT, false, false);

        this.getAllTicketsRequest();
    }
}
const managerSection = new ManagerSection();