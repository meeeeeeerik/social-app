// routes/stories.js — get stories
const express = require('express');
const { readDB, sanitizeUser } = require('../helpers');

const router = express.Router();

// GET /api/stories — get all active stories with author info
router.get('/', (req, res) => {
  const db = readDB();
  const stories = db.stories.map(story => {
    const user = db.users.find(u => u.id === story.userId);
    return { ...story, user: user ? sanitizeUser(user) : null };
  });
  res.json(stories);
});

module.exports = router;
