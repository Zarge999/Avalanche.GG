// server.js

const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://your-project-id.firebaseio.com"  // Replace with your Firebase database URL
});

const db = admin.firestore();

// Create an Express app
const app = express();
const port = 3000;

// Middleware for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route to get messages from Firestore (admin access only)
app.get('/api/messages', async (req, res) => {
    try {
        const messagesSnapshot = await db.collection('messages').get();
        const messages = [];
        messagesSnapshot.forEach(doc => {
            messages.push(doc.data());
        });
        res.json(messages);
    } catch (error) {
        res.status(500).send('Error fetching messages: ' + error.message);
    }
});

// Route to handle form submissions (contact form)
app.post('/api/messages', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await db.collection('messages').add({
            name,
            email,
            message,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(200).send('Message sent successfully!');
    } catch (error) {
        res.status(500).send('Error saving message: ' + error.message);
    }
});

// Route for the home page (optional, but good practice)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
