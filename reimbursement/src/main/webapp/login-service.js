
class LoginService {

	addLoginEventListener() {

		const loginButton = document.getElementById("login_button");
		loginButton.addEventListener('click', (e) => {
	
			const username = document.getElementById("username_text").value;
			const password = document.getElementById("password_text").value;
	
			this.fetchUser(username, password);
	
			e.preventDefault();
		});
	}

	async fetchUser(username_, password_) {

		const postParams = {
			username: username_,
			password: password_
		};

		shared.postRequest(postParams, "http://localhost:8080/reimbursement/login", (json, statusCode, errorMessage) => {

			const error = document.getElementById("login_error");
			if (errorMessage) {
				document.getElementById("username_text").value = "";
				document.getElementById("password_text").value = "";
				error.innerText = errorMessage;
				error.classList.remove("hide");
			}
			else {
				error.classList.add("hide");

				shared.user = json;

				if(shared.user.roleId == ROLE_EMPLOYEE) {

					employeeService.showSection();

					//if logged in as employee, do not display "manage tickets" nav bar menu item
					const manageTicketsNavItem = document.getElementById(NAV_LI[NAV_MANAGE_TICKETS]);
					manageTicketsNavItem.style.display = "none";
				}
				else if(shared.user.roleId === ROLE_MANAGER) {

					managerService.showSection();
				}
			}
		});
	}

	getUserXHR(username_, password_) {

		const xhr = new XMLHttpRequest();

		const url = "http://localhost:8080/reimbursement/login";
		xhr.open('GET', url);

		xhr.addEventListener('loadend', () => {
			const reponse = xhr.response;
		})

		xhr.send();
	}

	showSection() {

        //close other sections
        shared.closeSections();

        //open section
        const login = document.getElementById("login_section");
        login.style.display = "block";

		shared.clearData(); //clear data such as user

		//clear username and password fields
		document.getElementById("username_text").value = "";
		document.getElementById("password_text").value = "";

        //disable nav bar
		shared.disableNavBar();

        shared.setManageNavBarDisplay();		
    }
}
const loginService = new LoginService();