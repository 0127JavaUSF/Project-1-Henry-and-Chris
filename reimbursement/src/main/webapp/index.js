
async function fetchUser(username_, password_) {
	try {
		const config = {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: username_,
				password: password_
			})
		}

		let url = "http://localhost:8080/reimbursement/login";
		const response = await fetch(url, config);

		let json = await response.json()

		if (response.ok) {
		}
		else {
		}
	}
	catch (error) {
		let test = 0;
	}
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

		//fetchUser(username, password);
		//getUserXHR(username, password);

		window.location.href = "/reimbursement/employee-reimbursement.html";

		e.preventDefault();
	});
});