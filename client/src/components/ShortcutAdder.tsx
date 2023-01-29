import { h } from 'preact';
import { useRef } from 'preact/hooks';

const ShortcutIsland = (props) => {
     const snippetInput = useRef();
     const urlInput = useRef();

     return (
          <div class="w-11/12 mx-auto h-36 my-6 rounded-lg bg-gray-500">
			<h1 class="px-3 font-bold text-xl py-2 text-white">Add Your New Shortcut</h1>
			<div class="flex">
				<div class="font-bold flex-auto w-1/3 text-start p-3">
					<span class="px-2">Shortcut</span>
				</div>
				<div class="font-bold flex-auto w-2/3 p-3">
					<span class="px-2">URL</span>
				</div>
			</div>
			<div class="flex">
				<div class="font-bold flex-auto w-1/3 text-start p-3">
					<input type="text" ref={snippetInput} value="o/" class="w-96 py-1 px-2 rounded focus:outline-none bg-gray-200 mx-2 mb-0" placeholder="shortcut"/>
				</div>
				<div class="flex-auto w-1/3 text-start p-3">
					<input type="text" ref={urlInput} value="" class="w-96 py-1 px-2 rounded focus:outline-none bg-gray-200 mx-2 mb-0" placeholder="Your URL"/>
				</div>
				<div class="font-bold flex-auto w-1/3 text-start p-3">
					<button class="bg-rose-600 py-1 px-3 rounded drop-shadow" onClick={() => {
                              props.callback({ snippet: snippetInput.current.value, url: urlInput.current.value })
                         }}>Add</button>
				</div>
			</div>
		</div>
     );
};

export default ShortcutIsland;