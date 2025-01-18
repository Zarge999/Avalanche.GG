const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/avalanche_gg', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Message schema
const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    ip: String,
});

const Message = mongoose.model('Message', messageSchema);

app.use(cors());
app.use(bodyParser.json());

// Get all messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

// Post a new message
app.post('/api/messages', async (req, res) => {
    const { name, email, message, ip } = req.body;
    const newMessage = new Message({ name, email, message, ip });
    try {
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// Delete a message
app.delete('/api/messages/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).send('Message deleted');
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
