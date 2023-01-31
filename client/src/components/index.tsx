import React, { ChangeEvent, useState, useRef, MutableRefObject } from "react";
import { Redirect } from "react-router";
import SearchBarIsland from "./SearchBar";
import "../styles/global.css";

interface requestProps {
	method: string;
	headers: Headers;
	body: string;
}

const DashboardIsland = () => {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const existingId: string = localStorage.getItem("o-id");
	if (existingId) {
		window.location.href = "/dashboard";
		// return (<Redirect exact from="/" to="/dashboard"/>);
	}

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [errorText, setErrorText] = useState<string>("");
	const loginBtn: MutableRefObject<HTMLInputElement> = useRef();
	const errTxt: MutableRefObject<HTMLHeadingElement> = useRef();

	const clearErrTextTimeout = () => {
		const id = setTimeout(() => {
			errTxt.current.style.color = "red";
			errTxt.current.innerHTML = "";
			loginBtn.current.disabled = false;
		}, 3000);
	};

	function loginUser(email: string, password: string): void {
		loginBtn.current.value = "Loading...";
		loginBtn.current.disabled = true;

		const graphql = JSON.stringify({
			query: `
            query loginUser($email: String!, $pass: String!){
                loginUser(email: $email, password:	$pass){
                  id
                }
               }
            `,
			variables: {
				email: email,
				pass: password,
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
				const { data, errors } = JSON.parse(result);
                if(errors){
                    errTxt.current.innerHTML = errors[0].message;
					errTxt.current.style.color = "red";
					errTxt.current.style.display = "block";
					loginBtn.current.value = "Login";
                    clearErrTextTimeout();
                    return;
                }
				if (data.loginUser?.length > 0) {
					localStorage.setItem("o-id", data.loginUser[0].id);
					window.location.href = "/dashboard";
				}
			})
			.catch((err) => console.log("error", err));
	}

	return (
		<>
			<div>
				<input
					autoComplete="off"
					type="email"
					value={email}
					id="email-input"
					className="p-3 rounded bg-transparent border-b-1 border-black focus:outline-none"
					placeholder="Email"
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setEmail(e.target.value);
					}}
				/>
			</div>
			<div>
				<input
					autoComplete="off"
					type="password"
					value={password}
					id="pass-input"
					className="p-3 my-3 rounded bg-transparent border-b-1 border-black focus:outline-none"
					placeholder="Password"
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setPassword(e.target.value);
					}}
				/>
			</div>
			<h1 ref={errTxt} id="error-text" className="hidden">
				Invalid Email
			</h1>
			<input
				type="submit"
				ref={loginBtn}
				className="rounded"
				value="Login"
				onClick={() => {
					loginUser(email, password);
				}}
				id="login-btn"
			/>
			<h1 className="py-3">
				Don't Have an account?{" "}
				<a href="/signin" className="text-blue-500">
					Sign In
				</a>
			</h1>
		</>
	);
};

export default DashboardIsland;
