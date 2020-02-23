class ManagerService {

    fillManageTicketTable() {

        //todo: get from server

        //pretend this is the JSON response
        const response = [
            {
                id: "1",
                amount: 200.00,
                submitted: "Today",
                resolved: "",
                description: "Plane ticket.",
                authorId: 4,
                resolverId: 0,
                statusId: 1,
                typeId: 2
            },
            {
                id: "2",
                amount: 150.00,
                submitted: "Yesterday",
                resolved: "12:50 PM",
                description: "Company picnic.",
                authorId: 5,
                resolverId: 2,
                statusId: 3,
                typeId: 3
            }
        ];

        const body = document.getElementById("manage_ticket_body");
        let i = 0;
        for (let ticket of response) {

            let tr = document.createElement("tr");
            body.appendChild(tr);

            tr.classList.add("clickable_tr");
            tr.setAttribute("data-toggle", "collapse");
            tr.setAttribute("data-target", "#collaspe_div" + i);   

            shared.setTableCell(tr, ticket.id);
            shared.setTableCell(tr, ticket.submitted);
            shared.setTableCell(tr, ticket.authorId);
            shared.setTableCell(tr, TYPES[ticket.typeId]);
            shared.setTableCell(tr, ticket.amount);
            shared.setTableCell(tr, STATUSES[ticket.statusId]);
            shared.setTableCell(tr, ticket.resolved);
            shared.setTableCell(tr, ticket.resolverId);

            tr = document.createElement("tr");
            body.appendChild(tr);

            const td = document.createElement("td");
            tr.appendChild(td);
            td.setAttribute("colspan", "8");
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
            receiptImg.setAttribute("src", "https://my-project-1-bucket.s3.amazonaws.com/1");
            receiptImg.setAttribute("alt", "attachment");
            
            if(ticket.statusId === 1){
            tr = document.createElement("tr");
            body.appendChild(tr);

            const td2 = document.createElement("div")
            tr.appendChild(td2);
            td2.setAttribute("colspan", "2");
            td2.style.width = "100%";

            const div2 = document.createElement("div");
            div2.className = "btn-group w-150"
            body.appendChild(div2);
            
            const approve = document.createElement("input");
            approve.type = "button";
            approve.className = "btn btn-primary .revature_orange w-100";
            approve.value = "Approve";
            div2.appendChild(approve);

            const deny = document.createElement("input");
            deny.type = "button";
            deny.className = "btn btn-primary .revature_orange w-100";
            deny.value = "Deny";
            div2.appendChild(deny);
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

            i++;
        }
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
    }
}
const managerService = new ManagerService();