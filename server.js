require('dotenv').config(); // THIS MUST BE THE FIRST LINE
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Journey Log API is running...');
});

// === Define Routes ===
app.use('/api/auth', require('./routes/auth'));
app.use('/api/logs', require('./routes/logs'));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});