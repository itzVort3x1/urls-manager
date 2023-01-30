import React, { useState, useEffect, useRef } from 'react';
import ShortCutIsland from './ShortcutAdder';
import DisplayIsland from './Display';

interface snippetprops{
	url: string
	snippet: string
}

interface requestProps {
	method: string,
	headers: Headers,
	body: string
}

const ShortcutIsland = () => {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const [snippets, setSnippets] = useState<snippetprops[]>();
	const [searchString, setSearchString] = useState<string>("o/");
	const searchInput = useRef(null);

	

	function fetchSnippets(){
		const graphql = JSON.stringify({
			query: `
			query userShortcuts($user_id: ID!){
				userShortcuts(user_id: $user_id){
					snippet
					url
					id
				}
			}
			`,
			variables: {
				user_id: parseInt(localStorage.getItem("o-id"))
			}
		});

		const requestOptions: requestProps = {
			method: 'POST',
			headers: myHeaders,
			body: graphql,
		};

		fetch("https://oslash-clone.kaustubh10.workers.dev", requestOptions)
			.then(res => res.text())
			.then(result => {
				const { data } = JSON.parse(result);
				setSnippets(data.userShortcuts);
			})
			.catch(err => console.log('error', err));
	}

	useEffect(() => {
		fetchSnippets();
	}, []);

     return (
		<>
			<div className="w-11/12 mx-auto h-32 my-3 rounded-lg bg-gray-500">
				<h1 className="px-3 font-bold text-xl py-2 text-white">Search</h1>
				<input type="text" value={searchString} id="searchInput" onChange={(e) => {
					setSearchString(e.target.value);
				}} className="w-96 py-1 px-2 rounded focus:outline-none bg-gray-200 mx-3 mt-2 mb-0" placeholder="Search.."/>
				<br />
				<span className="px-3 text-sm text-gray-200">Search for you shortcut here..</span>
			</div>
			<ShortCutIsland callback={fetchSnippets}/>
			<DisplayIsland dataProp={snippets} searchString={searchString}/>
		</>
     );
};

export default ShortcutIsland;