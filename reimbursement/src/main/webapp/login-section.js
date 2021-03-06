
//note: this file uses JQuery for learning purposes

class LoginSection {

	addUsernameEventListener() {

		$("#username_text").blur((e) => {
			this.validateUsername();
		});
	}

	validateUsername() {
		let isValid = true;
		if(!$("#username_text").val()) {
			isValid = false;
			$("#username_required").prop("classList").remove("hide");	
		}
		else {
			$("#username_required").prop("classList").add("hide");	
		}
		return isValid;
	}

	addPasswordEventListener() {

		$("#password_text").blur((e) => {
			this.validatePassword();
		});
	}

	validatePassword() {
		let isValid = true;
		if(!$("#password_text").val()) {
			isValid = false;
			$("#password_required").prop("classList").remove("hide");	
		}
		else {
			$("#password_required").prop("classList").add("hide");	
		}
		return isValid;
	}

	//login button event listener
	addLoginEventListener() {

		$("#login_button").click((e) => {
	
			let isValid = this.validateUsername();
			if(!isValid) {
				e.preventDefault();
				return;
			}
			isValid = this.validatePassword();
			if(!isValid) {
				e.preventDefault();
				return;
			}

			const username = $("#username_text").val();
			const password = $("#password_text").val();
	
			this.getUserPostRequest(username, password);
	
			e.preventDefault();
		});
	}

	//get user post request
	async getUserPostRequest(username_, password_) {

		const postParams = {
			username: username_,
			password: password_
		};

		shared.postRequest(postParams, "http://localhost:8080/reimbursement/login", (json, statusCode, errorMessage) => {

			const error = $("#login_error");

			//if error
			if (errorMessage) {
				//clear form
				$("#username_text").val("");
				$("#password_text").val("");

				//show error
				error.text(errorMessage);
				error.prop("classList").remove("hide");
			}
			else {
				error.prop("classList").add("hide"); //hide error

				this.onLogin(json);
			}
		});
	}

	onLogin(user) {

		shared.user = user;

		//set username in nav bar
		$("#user_a").text(shared.user.username);

		//if employee
		if(shared.user.roleId == ROLE_EMPLOYEE) {

			//show employee section
			myTicketsSection.showSection();
			newTicketSection.showSection();

			//if logged in as employee, do not display "manage tickets" nav bar menu item
			$("#" + NAV_LI[NAV_MANAGE_TICKETS]).css("display", "none");
		}
		//if manager
		else if(shared.user.roleId === ROLE_MANAGER) {

			//show manager section
			managerSection.showSection();
		}
	}

	//get user using XMLHttpRequest (not used)
	getUserXHR(username_, password_) {

		const xhr = new XMLHttpRequest();

		const url = "http://localhost:8080/reimbursement/login";
		xhr.open("GET", url);

		xhr.addEventListener("loadend", () => {
			const reponse = xhr.response;
		})

		xhr.send();
	}

	//show the login section
	showSection() {

		//set username in nav bar
		$("#user_a").text("");
		
        //close other sections
        shared.closeSections();

        //open section
        $("#login_section").css("display", "block");

		shared.clearData(); //clear data such as user

		//clear username and password fields
		$("#username_text").val("");
		$("#password_text").val("");

        //disable nav bar
		navBar.disable();

        navBar.setManageDisplay();		
    }
}
const loginSection = new LoginSection();