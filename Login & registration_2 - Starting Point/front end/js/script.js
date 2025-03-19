const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})







const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})





if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})



const switchMode = document.getElementById('switch-mode');

if (switchMode) { // Add a null check
	switchMode.addEventListener('change', function () {
		if (this.checked) {
			document.body.classList.add('dark');
		} else {
			document.body.classList.remove('dark');
		}
	});
}




/*recived files and messagea*/
const messageForm = document.getElementById('messageForm');

if (messageForm) { // Add a null check
	messageForm.addEventListener('submit', function(event) {
		event.preventDefault();

		const message = document.getElementById('message').value;
		const fileInput = document.getElementById('file');
		const file = fileInput.files[0];

		// Encrypt the message
		const encryptedMessage = CryptoJS.AES.encrypt(message, 'secret key 123').toString();

		// Encrypt the file if it exists
		let encryptedFile = null;
		if (file) {
			const reader = new FileReader();
			reader.onload = function(e) {
				const fileContent = e.target.result;
				encryptedFile = CryptoJS.AES.encrypt(fileContent, 'secret key 123').toString();

				// Create a FormData object to send the encrypted message and file
				const formData = new FormData();
				formData.append('message', encryptedMessage);
				if (encryptedFile) {
					formData.append('file', encryptedFile);
				}

				// Send the encrypted message and file to the server
				fetch('http://localhost:5000/upload', {  // Change the URL to match your server
					method: 'POST',
					body: formData
				})
				.then(response => response.json())
				.then(data => {
					console.log('Success:', data);
					// Update the page with the received data
					updateReceivedData(data.message, data.file);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
			};
			reader.readAsDataURL(file);
		} else {
			// Create a FormData object to send the encrypted message
			const formData = new FormData();
			formData.append('message', encryptedMessage);

			// Send the encrypted message to the server
			fetch('http://localhost:5000/upload', {
				method: 'POST',
				body: formData
			})
			.then(response => response.json())
			.then(data => {
				console.log('Success:', data);
				// Update the page with the received data
				updateReceivedData(data.message);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
		}
	});
}
