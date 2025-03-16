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

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const CryptoJS = require('crypto-js');
const app = express();

mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true });

const receiveSchema = new mongoose.Schema({
	message: String,
	file: String
});

const Receive = mongoose.model('Receive', receiveSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/receive', upload.single('file'), async (req, res) => {
	try {
		const decryptedMessage = CryptoJS.AES.decrypt(req.body.message, 'secret key 123').toString(CryptoJS.enc.Utf8);
		const decryptedFile = CryptoJS.AES.decrypt(req.file.buffer.toString(), 'secret key 123').toString(CryptoJS.enc.Utf8);
		const receive = new Receive({
			message: decryptedMessage,
			file: decryptedFile
		});
		await receive.save();
		res.status(200).send('Data received successfully');
	} catch (error) {
		res.status(500).send('Failed to receive data');
	}
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});




/*recived files and messagea*/
document.getElementById('messageForm').addEventListener('submit', function(event) {
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
