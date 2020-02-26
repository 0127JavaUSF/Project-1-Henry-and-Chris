class ManagerService {

    constructor() {
        this.lastUsername = "";
        let ticketRowTotal = 0;
    }

    fillManageTicketTable() {

        //if same user (we already have tickets)
        if(this.lastUsername === shared.user.username) {
            return;
        }
        this.lastUsername = shared.user.username;

        //clear table
        const ticketBody = document.getElementById("manage_ticket_body");
        ticketBody.innerHTML = "";
        this.ticketRowTotal = 0;

        //get user tickets
        shared.getRequest( {}, "http://localhost:8080/reimbursement/get-all-reimb", (json, statusCode, errorMessage)=> {

            if(!errorMessage) {

                this.tickets = json;

                for (let ticket of this.tickets) {

                    this.addRowToTicketTable(ticket);
                }
            }
        });
    }

    addRowToTicketTable(ticket) {

        const body = document.getElementById("manage_ticket_body");

        let tr = document.createElement("tr");
        body.appendChild(tr);

        tr.classList.add("clickable_tr");
        tr.setAttribute("data-toggle", "collapse");
        tr.setAttribute("data-target", "#collaspe_div" + this.ticketRowTotal);   

        shared.setTableCell(tr, ticket.id);
        shared.setTableCell(tr, ticket.submittedString);
        shared.setTableCell(tr, ticket.authorString);
        shared.setTableCell(tr, TYPES[ticket.typeId]);
        shared.setTableCell(tr, shared.formatCurrency(ticket.amount));
        shared.setTableCell(tr, STATUSES[ticket.statusId]);
        shared.setTableCell(tr, ticket.resolvedString);
        shared.setTableCell(tr, ticket.resolverString);

        tr = document.createElement("tr");
        body.appendChild(tr);

        const td = document.createElement("td");
        tr.appendChild(td);
        td.setAttribute("colspan", "8");
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
        receiptImg.setAttribute("src", "https://my-project-1-bucket.s3.amazonaws.com/1");
        receiptImg.setAttribute("alt", "attachment");
        
        if(ticket.statusId === STATUS_PENDING){

            const outer = document.createElement("div");
            outer.className = "text-center";
            div.appendChild(outer);

            const inner = document.createElement("div");
            inner.className = "btn-group";
            outer.appendChild(inner);
            
            const approve = document.createElement("input");
            approve.type = "button";
            approve.className = "btn btn-primary revature_orange";
            approve.value = "Approve";
            inner.appendChild(approve);

            const deny = document.createElement("input");
            deny.type = "button";
            deny.className = "btn btn-primary revature_orange";
            deny.value = "Deny";
            inner.appendChild(deny);
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

        this.ticketRowTotal++;
    }

    showSection() {

        shared.closeSections();

        const managerSection = document.getElementById("manager_section");
        managerSection.style.display = "block";

        //update nav bar

        shared.setManageNavBarDisplay();

        shared.setNavBar(NAV_MY_TICKETS, false, false);
        shared.setNavBar(NAV_MANAGE_TICKETS, true, true);
        shared.setNavBar(NAV_LOG_OUT, false, false);

        this.fillManageTicketTable();
    }
}
const managerService = new ManagerService();