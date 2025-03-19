const mongoose = require('mongoose');

// Define the schema for messages
const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    file: { type: String },  // to store encrypted file content as string
    createdAt: { type: Date, default: Date.now }
});

// Create a model for messages
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
