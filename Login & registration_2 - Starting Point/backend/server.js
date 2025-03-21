require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
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
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Import message routes
const messageRoutes = require('./routes/messageRoutes');

// Use the routes for handling messages
app.use('/api/messages', messageRoutes);

const AWS = require('aws-sdk');

// Set up AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});

// Function to upload a file to S3
const uploadFile = async (fileContent, fileName) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName, // Name of the file to be saved
        Body: fileContent
    };

    return s3.upload(params).promise();
};

// Function to generate a signed URL for downloading a file from S3
const downloadFile = async (fileName) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Expires: 60 * 60 // URL expires in 1 hour
    };

    return s3.getSignedUrlPromise('getObject', params);
};

module.exports = { uploadFile, downloadFile };
