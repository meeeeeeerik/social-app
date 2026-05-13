// routes/comments.js — create and delete comments
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB, sanitizeUser } = require('../helpers');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/comments — add comment to a post
router.post('/', authMiddleware, (req, res) => {
  const { postId, content } = req.body;

  if (!postId || !content || !content.trim()) {
    return res.status(400).json({ error: 'Post ID and content are required' });
  }

  const db = readDB();
  const post = db.posts.find(p => p.id === postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const newComment = {
    id: uuidv4(),
    postId,
    authorId: req.userId,
    content: content.trim(),
    likes: [],
    createdAt: new Date().toISOString(),
  };

  db.comments.push(newComment);
  post.comments.push(newComment.id);
  writeDB(db);

  const author = db.users.find(u => u.id === req.userId);
  res.status(201).json({ ...newComment, author: author ? sanitizeUser(author) : null });
});

// DELETE /api/comments/:id — delete a comment (only author)
router.delete('/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const idx = db.comments.findIndex(c => c.id === req.params.id);

  if (idx === -1) return res.status(404).json({ error: 'Comment not found' });
  if (db.comments[idx].authorId !== req.userId) {
    return res.status(403).json({ error: 'You can only delete your own comments' });
  }

  const { postId } = db.comments[idx];
  db.comments.splice(idx, 1);

  // Remove comment id from post
  const post = db.posts.find(p => p.id === postId);
  if (post) post.comments = post.comments.filter(id => id !== req.params.id);

  writeDB(db);
  res.json({ message: 'Comment deleted' });
});

module.exports = router;
