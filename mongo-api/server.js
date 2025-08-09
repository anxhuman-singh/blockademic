const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Block schema
const blockSchema = new mongoose.Schema({
  name: String,
  degree: String,
  gpa: Number,
  major: String,
  timestamp: Number,
  nonce: Number,
  hash: String
}, {
  timestamps: true
});

const Block = mongoose.model('Block', blockSchema);

// Routes
// Get all blocks
app.get('/api/blocks', async (req, res) => {
  try {
    const blocks = await Block.find().sort({ createdAt: 1 });
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
});

// Create a new block
app.post('/api/blocks', async (req, res) => {
  try {
    const block = new Block(req.body);
    const savedBlock = await block.save();
    res.json(savedBlock);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save block' });
  }
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Start server
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});