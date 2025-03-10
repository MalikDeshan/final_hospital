const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const CryptoJS = require('crypto-js');
const app = express();

mongoose.connect('mongodb://localhost:27017/messagesDB', { useNewUrlParser: true, useUnifiedTopology: true });

const messageSchema = new mongoose.Schema({
    message: String,
    file: String
});

const Message = mongoose.model('Message', messageSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/your-server-endpoint', upload.single('file'), (req, res) => {
    const encryptedMessage = req.body.message;
    const encryptedFile = req.file ? req.file.buffer.toString('base64') : null;

    // Decrypt the message
    const bytesMessage = CryptoJS.AES.decrypt(encryptedMessage, 'secret key 123');
    const decryptedMessage = bytesMessage.toString(CryptoJS.enc.Utf8);

    // Decrypt the file if it exists
    let decryptedFile = null;
    if (encryptedFile) {
        const bytesFile = CryptoJS.AES.decrypt(encryptedFile, 'secret key 123');
        decryptedFile = bytesFile.toString(CryptoJS.enc.Utf8);
    }

    const newMessage = new Message({
        message: decryptedMessage,
        file: decryptedFile
    });

    newMessage.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send('Message and file saved successfully!');
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
