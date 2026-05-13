// routes/users.js — user profile, follow/unfollow
const express = require('express');
const { readDB, writeDB, sanitizeUser } = require('../helpers');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/users — get all users (for suggestions)
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.users.map(sanitizeUser));
});

// GET /api/users/:id — get user profile
router.get('/:id', (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(sanitizeUser(user));
});

// PUT /api/users/me — update current user profile
router.put('/me', authMiddleware, (req, res) => {
  const { name, bio, location, website, avatar } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;
  if (website !== undefined) user.website = website;
  if (avatar) user.avatar = avatar;

  writeDB(db);
  res.json(sanitizeUser(user));
});

// POST /api/users/:id/follow — follow or unfollow a user
router.post('/:id/follow', authMiddleware, (req, res) => {
  const db = readDB();
  const targetUser = db.users.find(u => u.id === req.params.id);
  const currentUser = db.users.find(u => u.id === req.userId);

  if (!targetUser) return res.status(404).json({ error: 'User not found' });
  if (targetUser.id === req.userId) {
    return res.status(400).json({ error: 'You cannot follow yourself' });
  }

  const isFollowing = currentUser.following.includes(targetUser.id);

  if (isFollowing) {
    // Unfollow
    currentUser.following = currentUser.following.filter(id => id !== targetUser.id);
    targetUser.followers = targetUser.followers.filter(id => id !== req.userId);
  } else {
    // Follow
    currentUser.following.push(targetUser.id);
    targetUser.followers.push(req.userId);
  }

  writeDB(db);
  res.json({
    following: !isFollowing,
    followersCount: targetUser.followers.length,
    followingCount: currentUser.following.length,
  });
});

// GET /api/users/:id/suggestions — who to follow (not already following)
router.get('/:id/suggestions', (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const suggestions = db.users
    .filter(u => u.id !== user.id && !user.following.includes(u.id))
    .slice(0, 5)
    .map(sanitizeUser);

  res.json(suggestions);
});

module.exports = router;
