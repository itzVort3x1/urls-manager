const emailInput = document.getElementById('email-input');
const errorText = document.getElementById('error-text');

const existingId = localStorage.getItem('o-id');
console.log(existingId);
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
	}, 3000);
}

document.getElementById('login-btn').addEventListener('click', async () => {
	if(!validateEmail(emailInput.value)){
		errorText.style.color = 'red';
		errorText.style.display = 'block';
		clearErrTextTimeout();
		return;
	}

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var graphql = JSON.stringify({
		query: `
			query getUsers{
				users {
					id
					name
					email
					Org_name
				}
			}
		`
	});

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: graphql,
		redirect: 'follow'
	};

	fetch("https://oslash-clone.kaustubh10.workers.dev", requestOptions)
		.then(res => res.text())
		.then(result => console.log(result))
		.catch(err => console.log('error', error));
});