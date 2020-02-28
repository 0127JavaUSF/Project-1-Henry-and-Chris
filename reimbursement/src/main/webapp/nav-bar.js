
class NavBar {

    constructor() {
    }

    //navigation bar click listeners
    addClickListeners() {

        //if "My Tickets" clicked
        const myTickets = document.getElementById(NAV_A[NAV_MY_TICKETS]);
        myTickets.addEventListener("click", (e)=> {

            //show employee section
            employeeService.showSection();

            e.preventDefault();
        });

        //if "Manage Tickets" clicked
        const manageTickets = document.getElementById(NAV_A[NAV_MANAGE_TICKETS]);
        manageTickets.addEventListener("click", (e)=> {

            //show manager section
            managerSection.showSection();

            e.preventDefault();
        });
    
        //if "Log out" clicked
        const logout = document.getElementById(NAV_A[NAV_LOG_OUT]);
        logout.addEventListener("click", (e)=> {

            //end server session
            shared.getRequest( {}, "http://localhost:8080/reimbursement/logout", (json, statusCode, errorMessage)=> {

                //show login section
                loginSection.showSection();
            });

            e.preventDefault();
        });
    }

    //disable all menu items on the nav bar
    disable() {

        //for all nav bar menu items
        for(let i = 0; i < NAV_LI.length; i++) {

            //make not active
            shared.removeClass(NAV_LI[i], "active");

            //make disabled
            shared.addClass(NAV_A[i], "disabled");
        }
    }

    //show or not show the "Manage Tickets" menu item in the nav bar
    setManageDisplay() {

        const manageTickets = document.getElementById(NAV_LI[NAV_MANAGE_TICKETS]);
        if(shared.user && shared.user.roleId === ROLE_MANAGER) {

            manageTickets.style.display = "block";
        }
        else {
            //do not show manage tickets menu item
            manageTickets.style.display = "none";
        }
    }

    //sets one menu item in the nav bar
    setMenuItem(navIndex, isActive, isDisabled) {

        const menuItemLI = document.getElementById(NAV_LI[navIndex]);
        if(isActive) {
            //make active
            shared.addClass(NAV_LI[navIndex], "active");
        }
        else {
            shared.removeClass(NAV_LI[navIndex], "active");
        }
        
        const menuItemA = document.getElementById(NAV_A[navIndex]);
        if(isDisabled) {
            //make disabled
            shared.addClass(NAV_A[navIndex], "disabled");
        }
        else {
            //remove disabled
            shared.removeClass(NAV_A[navIndex], "disabled");
        }
    }
}
const navBar = new NavBar();