const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl || !targetUrl.startsWith('http')) {
    return res.status(400).send('Missing or invalid URL');
  }

  try {
    const response = await axios.get(targetUrl);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(`Error fetching target: ${error.message}`);
  }
});

app.listen(3000, () => {
  console.log('Proxy server running on http://localhost:3000');
});
