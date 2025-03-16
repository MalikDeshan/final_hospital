const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user'); // Ensure correct import of User model

// Ensure MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB Connected');
}).catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
});

router.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        console.log(`Received signup request for email: ${email}`); // Debug log
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstname, lastname, email, password: hashedPassword });
        await newUser.save();
        console.log(`User ${email} registered successfully`); // Debug log
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during signup:', err); // Debug log
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Attempting to sign in user: ${email}`); // Debug log
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found'); // Debug log
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match'); // Debug log
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        console.log('User signed in successfully'); // Debug log
        res.status(200).json({ message: 'User signed in successfully' });
    } catch (err) {
        console.error('Error during signin:', err); // Debug log
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
