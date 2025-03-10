const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema and model for storing data
const fileSchema = new mongoose.Schema({
    message: String,
    filePath: String
});

const File = mongoose.model('File', fileSchema);

// API endpoint to receive data
app.post('/api/receive', (req, res) => {
    const { message, filePath } = req.body;

    const newFile = new File({ message, filePath });
    newFile.save((err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Data saved successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
