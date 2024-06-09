const express = require('express');
const morgan = require("morgan");
const path = require('path');
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// set up morgan middleware
app.use(morgan("tiny"));

// Serve the static files from the React app
const buildDirectoryPath = path.join(__dirname, '../build')
app.use(express.static(buildDirectoryPath));

// Handle other routes by serving the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

process.on('SIGINT', function() {
  process.exit();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
