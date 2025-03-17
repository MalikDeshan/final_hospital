const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a db.js file for database connection

router.post('/messages', async (req, res) => {
    try {
        const { message, file } = req.body;
        if (!message || !file) {
            return res.status(400).send('Message and file are required');
        }
        await db.query('INSERT INTO received_files (message, file) VALUES ($1, $2)', [message, file]);
        res.status(201).send('Message and file stored successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/', (req, res) => {
    res.send('Messages API is working');
});

module.exports = router;
