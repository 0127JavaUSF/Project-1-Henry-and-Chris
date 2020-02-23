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
                resolverId: 2,
                statusId: 1,
                typeId: 2
            },
            {
                id: "2",
                amount: 150.00,
                submitted: "Yesterday",
                resolved: "",
                description: "Company picnic.",
                authorId: 5,
                resolverId: 0,
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
            shared.setTableCell(tr, shared.getReimbursementType(ticket.typeId));
            shared.setTableCell(tr, ticket.amount);
            shared.setTableCell(tr, shared.getStatus(ticket.statusId));
            shared.setTableCell(tr, ticket.resolved);
            shared.setTableCell(tr, ticket.resolverId);

            const td = document.createElement("td");
            tr.appendChild(td);
            td.setAttribute("colspan", "9");
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