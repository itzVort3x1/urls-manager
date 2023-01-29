import React from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import ShortCutIsland from './ShortcutAdder.tsx';
import DisplayIsland from './Display.tsx';

interface snippetprops{
	url: string
	snippet: string
}

const ShortcutIsland = () => {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const [snippets, SetSnippets] = useState<snippetprops[]>();
	const [searchString, setSearchString] = useState<string>("o/");
	const searchInput = useRef();

	function addNewVal(val: snippetprops){
		var graphql = JSON.stringify({
			query: `
			mutation createShortcut($user_id: ID!, $snippet: String!, $url: String!){
				createShortcut(user_id: $user_id, 
					snippet: $snippet,
				  url: $url
				){
				  user_id
				}
			   }
			`,
			variables: {
				user_id: parseInt(localStorage.getItem("o-id")),
				snippet: val.snippet,
				url: val.url
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
				fetchSnippets();
				location.reload();
			})
			.catch(err => console.log('error', error));
	}

	function fetchSnippets(){
		var graphql = JSON.stringify({
			query: `
			query userShortcuts($user_id: ID!){
				userShortcuts(user_id: $user_id){
					snippet
					url
				}
			}
			`,
			variables: {
				user_id: parseInt(localStorage.getItem("o-id"))
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
				SetSnippets(data.userShortcuts);
			})
			.catch(err => console.log('error', error));
	}

	useEffect(() => {
		fetchSnippets();
		document.getElementById('searchInput').addEventListener('keyup', () => {
			console.log(searchInput.current.value);
			// fetchSearchingSnippet(searchInput.current.value);
			// searchInput.current.value = searchString;
			setSearchString(searchInput.current.value);
		})
	}, []);

     return (
		<>
			<div class="w-11/12 mx-auto h-28 my-3 rounded-lg bg-gray-500">
				<h1 class="px-3 font-bold text-xl py-2 text-white">Search</h1>
				<input type="text" value={searchString} id="searchInput"  ref={searchInput}  class="w-96 py-1 px-2 rounded focus:outline-none bg-gray-200 mx-3 mt-2 mb-0" placeholder="Search.."/>
				<br />
				<span class="px-3 text-sm text-gray-200">Search for you shortcut here..</span>
			</div>
			<ShortCutIsland callback={addNewVal}/>
			<DisplayIsland dataProp={snippets} searchString={searchString} callback={fetchSnippets}/>
		</>
     );
};

export default ShortcutIsland;