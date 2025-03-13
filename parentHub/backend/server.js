const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const POSTS_FILE = path.join(__dirname, 'data/posts.json');

// Get all posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await fs.readFile(POSTS_FILE, 'utf8');
        res.json(JSON.parse(posts));
    } catch (error) {
        res.json([]);
    }
});

// Save/update posts
app.post('/api/posts', async (req, res) => {
    try {
        await fs.writeFile(POSTS_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save posts' });
    }
});

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
