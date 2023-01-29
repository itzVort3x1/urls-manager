const existingId = localStorage.getItem('o-id');
if(!existingId){
	window.location.href = '/'
}

document.getElementById('logout-btn').addEventListener('click', () => {
	localStorage.removeItem('o-id');
	window.location.href = '/';
})