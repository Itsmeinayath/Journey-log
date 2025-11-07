const express = require('express');
const connectDB = require('./config/db');
const app = express();
connectDB();

const PORT = 5000; // Or whatever you like


app.get('/', (req, res) => {
  res.send('Journey Log API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});