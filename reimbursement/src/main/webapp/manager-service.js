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
            shared.setTableCell(tr, ticket.resolved);
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