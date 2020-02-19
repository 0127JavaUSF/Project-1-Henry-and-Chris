
async function fetchUser(username_, password_) {

	const postParams = {
		username: username_,
		password: password_
	};

	postRequest(postParams, "http://localhost:8080/reimbursement/login", (json, errorMessage)=> {

		if(errorMessage) {

			let error = document.getElementById("login_error");
			error.innerText = errorMessage;
			error.classList.remove("hide");
		}
	});
}

function getUserXHR(username_, password_) {

	const xhr = new XMLHttpRequest();

	let url = "http://localhost:8080/reimbursement/login";
	xhr.open('GET', url);

	xhr.addEventListener('loadend', () => {
		const reponse = xhr.response;
	})

	xhr.send();
}

document.addEventListener("DOMContentLoaded", function () {

	let loginButton = document.getElementById("login_button");
	loginButton.addEventListener('click', (e) => {

		const username = document.getElementById("username_text").value;
		const password = document.getElementById("password_text").value;

		fetchUser(username, password);
		//getUserXHR(username, password);

		//window.location.href = "/reimbursement/employee-reimbursement.html";

		e.preventDefault();
	});
});