import React, {ChangeEvent, MutableRefObject, useRef, useState} from 'react';

interface snippetprops{
	url: string
	snippet: string
}

interface requestProps {
	method: string,
	headers: Headers,
	body: string
}

const ShortcutIsland = ({callback}: {callback: () => void}) => {

	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	 const [snippet, setSnippet] = useState<string>('o/');
	 const [url, setUrl] = useState<string>('');
	 const errTxt: MutableRefObject<HTMLSpanElement> = useRef(null);

	 const clearErrTextTimeout = () => {
		const id = setTimeout(() => {
			errTxt.current.style.color = "red";
			errTxt.current.innerHTML = "";
		}, 3000);
	};


	 function uuid(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c: string): string {
			const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	}

	function addNewVal(val: snippetprops){
		const graphql = JSON.stringify({
			query: `
			mutation createShortcut($user_id: ID!, $snippet: String!, $url: String!, $id: String!){
				createShortcut(user_id: $user_id, 
					snippet: $snippet,
				  url: $url,
				  id: $id
				){
				  user_id
				}
			   }
			`,
			variables: {
				user_id: parseInt(localStorage.getItem("o-id")),
				snippet: val.snippet,
				url: val.url,
				id: uuid()
			}
		});

		const requestOptions: requestProps = {
			method: 'POST',
			headers: myHeaders,
			body: graphql
		};

		fetch("https://oslash-clone.kaustubh10.workers.dev", requestOptions)
			.then(res => res.text())
			.then(result => {
				const {data, errors} = JSON.parse(result);
				if(errors){
					errTxt.current.innerHTML = 'Please Enter All The Fields';
					errTxt.current.style.color = 'red';
					clearErrTextTimeout();
                    return;
				}
				setSnippet("o/");
				setUrl("");
				callback();
			})
			.catch(err => console.log('error', err));
	}

     return (
          <div className="w-11/12 mx-auto h-48 my-6 rounded-lg bg-gray-500">
			<h1 className="px-3 font-bold text-xl py-2 text-white">Add Your New Shortcut</h1>
			<div className="flex">
				<div className="font-bold flex-auto w-1/3 text-start p-3">
					<span className="px-2">Shortcut</span>
				</div>
				<div className="font-bold flex-auto w-2/3 p-3">
					<span className="px-2">URL</span>
				</div>
			</div>
			<div className="flex">
				<div className="font-bold flex-auto w-1/3 text-start p-3">
					<input type="text" value={snippet} onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setSnippet(e.target.value);
					}} className="w-96 py-1 px-2 rounded focus:outline-none bg-gray-200 mx-2 mb-0" placeholder="shortcut"/>
				</div>
				<div className="flex-auto w-1/3 text-start p-3">
					<input type="text" value={url} onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setUrl(e.target.value);
					}} className="w-96 py-1 px-2 rounded focus:outline-none bg-gray-200 mx-2 mb-0" placeholder="Your URL"/>
				</div>
				<div className="font-bold flex-auto w-1/3 text-start p-3">
					<button className="bg-rose-600 py-1 px-3 rounded drop-shadow" onClick={() => {
						addNewVal({ snippet: snippet, url: url })
					}}>Add</button>
				</div>
			</div>
			<div className='text-center'>
				<span className='font-bold' ref={errTxt}></span>
			</div>
		</div>
     );
};

export default ShortcutIsland;