import React, { useState, useEffect } from "react";
import ShortCutIsland from "./ShortcutAdder";
import { useStore } from "@nanostores/react";
import { searchString } from "../context/store";

interface requestProps {
	method: string;
	headers: Headers;
	body: string;
}

interface snippetprops {
	url: string;
	snippet: string;
}

const ShortcutIsland = ({ dataProp }: { dataProp: snippetprops[] }) => {
	const [snippets, setSnippets] = useState(dataProp);
	const $searchString = useStore<any>(searchString);

	console.log("stores search string", $searchString);

	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	function fetchSearchingSnippet(searchString: string) {
		const graphql = JSON.stringify({
			query: `
			query getShortcut($snippet: String, $user_id: ID){
				getShortcut(snippet: $snippet, user_id: $user_id){
				  snippet
				  url
				  id
				}
			   }
			`,
			variables: {
				user_id: parseInt(localStorage.getItem("o-id")),
				snippet: searchString,
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
				console.log(data);
				setSnippets(data.getShortcut);
			})
			.catch((err) => console.log("error", err));
	}

	function deleteSnippet(user_id: number, snippet: string) {
		const graphql = JSON.stringify({
			query: `
			mutation deleteShortcut($snippet: String!, $user_id: ID!){
                    deleteShortcut(snippet: $snippet, user_id: $user_id){
                      user_id
                    }
                  }
			`,
			variables: {
				user_id: user_id,
				snippet: snippet,
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
				fetchSearchingSnippet("o/");
			})
			.catch((err) => console.log("error", err));
	}

	useEffect(() => {
		setSnippets(dataProp);
	}, [dataProp]);

	useEffect(() => {
		fetchSearchingSnippet($searchString);
	}, [$searchString]);

	return (
		<>
			<div className="w-11/12 mx-auto h-96 my-7 rounded-lg bg-gray-500">
				<div className="flex">
					<div className="font-bold flex-auto w-1/4 text-start p-3">
						<span className="">Shortcut</span>
					</div>
					<div className="font-bold flex-auto w-3/4 p-3">
						<span className="px-2">URL</span>
					</div>
				</div>
				<div className="max-h-80 overflow-auto overflow-x-hidden">
					{snippets?.length == 0 && (
						<div className="text-center my-24 font-fold text-lg">
							You have no snippets <br /> Create Shortcuts
						</div>
					)}
					{snippets?.length > 0 &&
						snippets.map((item, index) => {
							return (
								<div key={index} className="flex">
									<div className="font-bold flex-auto w-1/4 text-start p-3">
										<div className="bg-gray-400 p-2 rounded">
											{item.snippet}
										</div>
									</div>
									<div className="font-bold flex-auto w-2/4 p-3">
										<div className="bg-gray-400 p-2 rounded">{item.url}</div>
									</div>
									<div className="font-bold flex-auto w-1/4 p-3">
										<button
											className="bg-teal-400 mx-2 py-2 px-3 rounded drop-shadow"
											onClick={() => {
												window.open(item.url, "_blank");
											}}
										>
											Open
										</button>
										<button
											className="bg-rose-600 mx-2 py-2 px-3 rounded drop-shadow"
											onClick={() => {
												deleteSnippet(
													parseInt(localStorage.getItem("o-id")),
													item.snippet
												);
											}}
										>
											Delete
										</button>
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</>
	);
};

export default ShortcutIsland;
