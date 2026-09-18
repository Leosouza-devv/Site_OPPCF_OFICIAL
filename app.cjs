const express = require('express');
const dotenv = require('dotenv').config();
const app = express();

app.use(express.static('public'));
app.use(express.static('public/static'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/static/index.html');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});