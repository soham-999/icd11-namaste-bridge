const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("Server is alive and listening!");
});

app.listen(5000, '127.0.0.1', () => {
    console.log("Test server is running on port 5000");
});