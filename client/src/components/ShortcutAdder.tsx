import { h } from 'preact';
import { useRef } from 'preact/hooks';

const ShortcutIsland = (props) => {
     const snippetInput = useRef(null);
     const urlInput = useRef(null);

     return (
          <div className="w-11/12 mx-auto h-36 my-6 rounded-lg bg-gray-500">
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
					<input type="text" ref={snippetInput} value="o/" className="w-96 py-1 px-2 rounded focus:outline-none bg-gray-200 mx-2 mb-0" placeholder="shortcut"/>
				</div>
				<div className="flex-auto w-1/3 text-start p-3">
					<input type="text" ref={urlInput} value="" className="w-96 py-1 px-2 rounded focus:outline-none bg-gray-200 mx-2 mb-0" placeholder="Your URL"/>
				</div>
				<div className="font-bold flex-auto w-1/3 text-start p-3">
					<button className="bg-rose-600 py-1 px-3 rounded drop-shadow" onClick={() => {
                              props.callback({ snippet: snippetInput.current.value, url: urlInput.current.value })
                         }}>Add</button>
				</div>
			</div>
		</div>
     );
};

export default ShortcutIsland;