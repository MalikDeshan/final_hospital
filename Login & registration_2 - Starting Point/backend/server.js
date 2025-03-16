require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Load environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB Connected');
}).catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
});

// Set up Multer for file handling (storing files temporarily in 'uploads' folder)
const upload = multer({ dest: 'uploads/' });

// Define the Message schema for storing messages and file info
const messageSchema = new mongoose.Schema({
    message: String,
    file: String, // Store file info or file path in DB
});

const Message = mongoose.model('Message', messageSchema);

// Route for user login (JWT authentication)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // For simplicity, checking hardcoded credentials (this would be replaced by a database check in a real app)
    if (username === 'admin' && password === 'password') {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Route for receiving messages and files (using JWT for authorization)
app.post('/upload', upload.single('file'), async (req, res) => {
    const encryptedMessage = req.body.message;
    const encryptedFile = req.body.file;

    // Save the message and file info in MongoDB (optional)
    const newMessage = new Message({
        message: encryptedMessage,
        file: encryptedFile, // You could save the file path here if you choose to store it
    });

    try {
        await newMessage.save();
        res.status(200).json({ message: 'Message and file received successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error saving message and file', details: err });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
