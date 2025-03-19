const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');

// POST request to save messages
router.post('/', async (req, res) => {
    const { message, file } = req.body;

    try {
        const newMessage = new Message({ message, file });
        await newMessage.save();
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// GET request to retrieve messages
router.get('/received', async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router;
