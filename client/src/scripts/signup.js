const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const orgInput = document.getElementById('org-input');
const passInput = document.getElementById('pass-input');
const cpassInput = document.getElementById('cpass-input');
const signBtn = document.getElementById('sign-btn');
const errTxt = document.getElementById('error-text');

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
var totalUsers;

var graphql = JSON.stringify({
     query: `
     query {
          totalUsers
     }
     `
});

var requestOptionsTotal = {
     method: 'POST',
     headers: myHeaders,
     body: graphql,
     redirect: 'follow'
};

fetch("https://oslash-clone.kaustubh10.workers.dev", requestOptionsTotal)
     .then(res => res.text())
     .then(result => {
          const { data } = JSON.parse(result);
          totalUsers = data.totalUsers;
     })
     .catch(err => console.log('error', error));


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
		errTxt.style.display = 'none';
		signBtn.disabled = false;
	}, 3000);
}

document.getElementById('sign-btn').addEventListener('click', async () => {
     signBtn.value = 'Loading...';
     signBtn.disabled = true;

     if(!validateEmail(emailInput.value)){
		errTxt.style.color = 'red';
		errTxt.style.display = 'block';
		signBtn.value = "Sign Up";
		clearErrTextTimeout();
		return;
	}

     if(cpassInput.value.length < 6){
          errTxt.innerHTML = 'Password should be greater than 6 characters'
          errTxt.style.color = 'red';
		errTxt.style.display = 'block';
		signBtn.value = "Sign Up";
		clearErrTextTimeout();
     }

     if(cpassInput.value.toLowerCase() !== passInput.value.toLowerCase()){
          errTxt.innerHTML = 'Passwords Do Not Match'
          errTxt.style.color = 'red';
		errTxt.style.display = 'block';
		signBtn.value = "Sign Up";
		clearErrTextTimeout();
     }

     var graphql = JSON.stringify({
          query: `
		mutation createUser($name: String!, $email: String!, $Org_name: String!, $password: String!, $id: ID!){
               createUser(
                 name: $name,
                 email: $email,
                 Org_name: $Org_name,
                 password: $password,
                 id: $id
               ){
                 id
                 email
               }
             }
		`,
		variables: {
			name: nameInput.value,
               email: emailInput.value,
               Org_name: orgInput.value,
               password: passInput.value,
               id: totalUsers
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
               localStorage.setItem("o-id", data.createUser.id);
               window.location.href = "/dashboard";
		})
		.catch(err => console.log('error', error));

})