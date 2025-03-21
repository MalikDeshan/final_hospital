const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs'); // Add this line to import the fs module
const { uploadFile, downloadFile } = require('../server'); // Import the uploadFile and downloadFile functions

// POST request to send messages and files
router.post('/', upload.single('file'), async (req, res) => {
    const { message } = req.body;
    const file = req.file;

    if (!message) {
        return res.status(400).json({ error: 'Message content is required.' });
    }

    let fileUrl = '';
    if (file) {
        try {
            const fileContent = fs.readFileSync(file.path);
            const fileUpload = await uploadFile(fileContent, file.originalname);
            fileUrl = fileUpload.Key; // Store the file key (not the full URL)
        } catch (error) {
            return res.status(500).json({ error: 'File upload failed.' });
        }
    }

    try {
        // Save message to the database
        const newMessage = new Message({
            message,
            file: fileUrl
        });
        await newMessage.save();

        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save message.' });
    }
});

// GET request to retrieve messages
router.get('/received', async (req, res) => {
    try {
        const messages = await Message.find();

        // Generate signed URLs for files
        const messagesWithSignedUrls = await Promise.all(
            messages.map(async (msg) => {
                if (msg.file) {
                    msg.file = await downloadFile(msg.file); // Replace file key with signed URL
                }
                return msg;
            })
        );

        res.status(200).json(messagesWithSignedUrls);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router;
