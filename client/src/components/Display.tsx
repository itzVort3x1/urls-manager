import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import ShortCutIsland from './ShortcutAdder.tsx';

const ShortcutIsland = ({ dataProp, searchString }) => {

     const [snippets, setSnippets] = useState(dataProp);

     var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

     function fetchSearchingSnippet(searchString: string){
		var graphql = JSON.stringify({
			query: `
			query getShortcut($snippet: String, $user_id: ID){
				getShortcut(snippet: $snippet, user_id: $user_id){
				  snippet
				  url
				}
			   }
			`,
			variables: {
				user_id: parseInt(localStorage.getItem("o-id")),
				snippet: searchString
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
				console.log(data);
				setSnippets(data.getShortcut);
			})
			.catch(err => console.log('error', error));
	}

     function deleteSnippet(user_id: number, snippet: string){
             var graphql = JSON.stringify({
			query: `
			mutation deleteShortcut($snippet: String!, $user_id: ID!){
                    deleteShortcut(snippet: $snippet, user_id: $user_id){
                      user_id
                    }
                  }
			`,
			variables: {
				user_id: user_id,
				snippet: snippet
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
                    fetchSearchingSnippet("o/");
			})
			.catch(err => console.log('error', error));
     }

     useEffect(() => {
          fetchSearchingSnippet(searchString);
	}, [searchString]);

     return (
		<>
			<div class="w-11/12 mx-auto h-96 my-7 rounded-lg bg-gray-500">
                    <div class="flex">
                         <div class="font-bold flex-auto w-1/4 text-start p-3">
                              <span class="">Shortcut</span>
                         </div>
                         <div class="font-bold flex-auto w-3/4 p-3">
                              <span class="px-2">URL</span>
                         </div>
                    </div>
                    <div class="max-h-80 overflow-auto overflow-x-hidden">
                    {snippets?.length == 0 && <div class='text-center my-24 font-fold text-lg'>You have no snippets <br /> Create Shortcuts</div>}
                    {snippets?.length > 0 && snippets.map((item, index) => {
                         return (
                              <div class="flex">
                                   <div class="font-bold flex-auto w-1/4 text-start p-3">
                                        <div class="bg-gray-400 p-2 rounded">{ item.snippet }</div>
                                   </div>
                                   <div class="font-bold flex-auto w-2/4 p-3">
                                        <div class="bg-gray-400 p-2 rounded">{ item.url }</div>
                                   </div>
                                   <div class="font-bold flex-auto w-1/4 p-3">
                                        <button class="bg-teal-400 mx-2 py-2 px-3 rounded drop-shadow" onClick={() => {
                                             window.open(item.url, "_blank")
                                        }}>Open</button>
                                        <button class="bg-rose-600 mx-2 py-2 px-3 rounded drop-shadow" onClick={() => {
                                             deleteSnippet(parseInt(localStorage.getItem("o-id")), item.snippet)
                                        }}>Delete</button>
                                   </div>
                              </div>
                         )
                    })}
                    </div>
               </div>
		</>
     );
};

export default ShortcutIsland;