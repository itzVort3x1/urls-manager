const emailInput = document.getElementById('email-input');
const passInput = document.getElementById('pass-input');
const errorText = document.getElementById('error-text');
const loginBtn = document.getElementById('login-btn');

const existingId = localStorage.getItem('o-id');
if(existingId){
	window.location.href = '/dashboard'
}

const validateEmail = (mail) => {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
    		return (true)
  	}
	return (false)
}

const clearErrTextTimeout = () => {
	const id = setTimeout(() => {
		errorText.style.display = 'none';
		loginBtn.disabled = false;
	}, 3000);
}

document.getElementById('login-btn').addEventListener('click', async () => {
	loginBtn.value = 'Loading...'
	loginBtn.disabled = true;
	if(!validateEmail(emailInput.value)){
		errorText.style.color = 'red';
		errorText.style.display = 'block';
		loginBtn.value = "Login"
		clearErrTextTimeout();
		return;
	}

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var graphql = JSON.stringify({
		query: `
		query loginUser($email: String!, $pass: String!){
			loginUser(email: $email, password:	$pass){
			  id
			}
		   }
		`,
		variables: {
			email: emailInput.value,
			pass: passInput.value
		}
	});

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: graphql,
		redirect: 'follow'
	};

	fetch("https://oslash-clone.kaustubh10.workers.dev", requestOptions)
		.then(res => res.text())
		.then(result => {
			const { data } = JSON.parse(result);
			if(data.loginUser.length > 0){
				localStorage.setItem("o-id", data.loginUser[0].id);
				window.location.href = "/dashboard";
			}else {
				errorText.innerHTML = "Email Or Password is Incorrect";
				errorText.style.color = 'red';
				errorText.style.display = 'block';
				loginBtn.value = "Login"
				clearErrTextTimeout();
			}
		})
		.catch(err => console.log('error', error));
});