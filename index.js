const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, 'stfu.png')));
app.use(express.static(__dirname));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/dc', (req, res) => res.sendFile(path.join(__dirname, 'dc.html')));
app.get('/.well-known/discord', (req, res) => res.send('dh=6cfeb553898f125458c3bcdf4404c84a7a412fe9'));
app.get('/:file', (req, res) => {
  const fileName = req.params.file;
  const filePath = path.join(__dirname, fileName);
  res.sendFile(filePath, err => {
    if (err) res.status(404).sendFile(path.join(__dirname, '404.html'));
  });
});

app.get('/quote', async (req, res) => {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    res.json({ text: data.content, author: data.author });
  } catch (err) {
    res.status(500).json({ text: 'Failed to fetch quote.', author: '' });
  }
});

app.listen(PORT, (err) => {
  if (err) console.error('Error in server setup');
  else console.log(`Server listening on Port ${PORT}`);
});
