import React, {
	useState,
	useRef,
	ChangeEvent,
	MutableRefObject,
	useEffect,
} from "react";

interface requestProps {
	method: string;
	headers: Headers;
	body: string;
}

const SignInIsland = () => {
	const existingId: string = localStorage.getItem("o-id");
	if (existingId) {
		window.location.href = "/dashboard";
	}

	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [org, setOrg] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [cpassword, setCpassword] = useState<string>("");
	const signBtn: MutableRefObject<HTMLInputElement> = useRef();
	const errTxt: MutableRefObject<HTMLHeadingElement> = useRef();

	let totalUsers: number, existingUsers: [{ email: string }];

	const validateEmail: (mail: string) => boolean = (mail) => {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
			return true;
		}
		return false;
	};

	const clearErrTextTimeout: () => void = () => {
		const id = setTimeout(() => {
			errTxt.current.style.display = "none";
			errTxt.current.innerHTML = "";
			signBtn.current.disabled = false;
		}, 3000);
	};

	useEffect(() => {
		const graphql: string = JSON.stringify({
			query: `
            query {
                totalUsers
            }
            `,
		});

		const requestOptionsTotal: requestProps = {
			method: "POST",
			headers: myHeaders,
			body: graphql,
		};

		fetch("https://oslash-clone.kaustubh10.workers.dev", requestOptionsTotal)
			.then((res) => res.text())
			.then((result) => {
				const { data } = JSON.parse(result);
				totalUsers = data.totalUsers;
			})
			.catch((err) => console.log("error", err));
	}, []);

	// This is to Check if there is an existing email.
	useEffect(() => {
		const getData = setTimeout(() => {
			const graphql = JSON.stringify({
				query: `
                query getUser($email: String!){
                    getUser(email: $email){
                       email
                    }
                }
                `,
				variables: {
					email: email,
				},
			});

			const requestOptionsTotal: requestProps = {
				method: "POST",
				headers: myHeaders,
				body: graphql,
			};

			fetch("https://oslash-clone.kaustubh10.workers.dev", requestOptionsTotal)
				.then((res) => {
					return res.text();
				})
				.then((result) => {
					const { data, errors } = JSON.parse(result);
					console.log(errors);
					existingUsers = data.getUser;
				})
				.catch((err) => console.log("error", err));
		}, 1000);
		return () => clearTimeout(getData);
	}, [email]);

	function signInUser(
		name: string,
		email: string,
		orgVal,
		pass: string,
		cpass: string
	) {
		// signBtn.current.innerHTML = 'Loading...';
		//  signBtn.current.disabled = true;

		if (
			name == "" ||
			email == "" ||
			orgVal == "" ||
			pass == "" ||
			cpass == ""
		) {
			errTxt.current.innerHTML = "Please Fill All The Fields";
			errTxt.current.style.color = "red";
			errTxt.current.style.display = "block";
			// signBtn.current.value = "Sign Up";
			clearErrTextTimeout();
			return;
		}

		if (existingUsers.length > 0) {
			errTxt.current.innerHTML = "Email Already Exists";
			errTxt.current.style.color = "red";
			errTxt.current.style.display = "block";
			signBtn.current.value = "Sign Up";
			clearErrTextTimeout();
			return;
		}

		if (!validateEmail(email)) {
			errTxt.current.style.color = "red";
			errTxt.current.style.display = "block";
			signBtn.current.value = "Sign Up";
			clearErrTextTimeout();
			return;
		}

		if (cpass.length < 6) {
			errTxt.current.innerHTML = "Password should be greater than 6 characters";
			errTxt.current.style.color = "red";
			errTxt.current.style.display = "block";
			signBtn.current.value = "Sign Up";
			clearErrTextTimeout();
			return;
		}

		if (cpass.toLowerCase() !== pass.toLowerCase()) {
			errTxt.current.innerHTML = "Passwords Do Not Match";
			errTxt.current.style.color = "red";
			errTxt.current.style.display = "block";
			signBtn.current.value = "Sign Up";
			clearErrTextTimeout();
			return;
		}

		const graphql = JSON.stringify({
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
				name: name,
				email: email,
				Org_name: orgVal,
				password: pass,
				id: totalUsers,
			},
		});

		const requestOptions: requestProps = {
			method: "POST",
			headers: myHeaders,
			body: graphql,
		};

		fetch("https://oslash-clone.kaustubh10.workers.dev", requestOptions)
			.then((res) => res.text())
			.then((result) => {
				const { data } = JSON.parse(result);
				localStorage.setItem("o-id", data.createUser.id);
				window.location.href = "/dashboard";
			})
			.catch((err) => console.log("error", err));
	}

	return (
		<>
			<input
				autoComplete="off"
				type="text"
				value={name}
				id="name-input"
				className="p-3 my-2 rounded bg-transparent border-b-1 border-black focus:outline-none"
				placeholder="Name"
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					setName(e.target.value);
				}}
			/>
			<br />
			<input
				autoComplete="off"
				type="email"
				value={email}
				id="email-input"
				className="p-3 my-2 rounded bg-transparent  border-b-1 border-black focus:outline-none"
				placeholder="Email"
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					setEmail(e.target.value);
				}}
			/>
			<br />
			<input
				autoComplete="off"
				type="text"
				value={org}
				id="org-input"
				className="p-3 my-2 rounded bg-transparent  border-b-1 border-black focus:outline-none"
				placeholder="Organization Name"
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					setOrg(e.target.value);
				}}
			/>
			<br />
			<input
				autoComplete="off"
				type="password"
				value={password}
				id="pass-input"
				className="p-3 my-2 rounded bg-transparent  border-b-1 border-black focus:outline-none"
				placeholder="Password"
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					setPassword(e.target.value);
				}}
			/>
			<br />
			<input
				autoComplete="off"
				type="password"
				value={cpassword}
				id="cpass-input"
				className="p-3 my-2 rounded bg-transparent  border-b-1 border-black focus:outline-none"
				placeholder="Confirm Password"
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					setCpassword(e.target.value);
				}}
			/>
			<br />
			<span id="error-text" ref={errTxt} className="hidden">
				Invalid Email
			</span>
			<div>
				<button
					className="bg-rose-600 py-2 px-4 my-2 rounded"
					id="sign-btn"
					onClick={() => {
						signInUser(name, email, org, password, cpassword);
					}}
				>
					Sign Up
				</button>
			</div>
			<h1 className="py-3">
				Have an account?
				<a href="/" className="text-blue-500">
					Log In
				</a>
			</h1>
		</>
	);
};

export default SignInIsland;
