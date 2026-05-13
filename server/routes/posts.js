// routes/posts.js — CRUD for posts + likes
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB, sanitizeUser } = require('../helpers');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Helper: attach author info to each post
function enrichPost(post, db) {
  const author = db.users.find(u => u.id === post.authorId);
  const comments = db.comments
    .filter(c => post.comments.includes(c.id))
    .map(c => {
      const commentAuthor = db.users.find(u => u.id === c.authorId);
      return { ...c, author: commentAuthor ? sanitizeUser(commentAuthor) : null };
    })
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return {
    ...post,
    author: author ? sanitizeUser(author) : null,
    comments,
    likesCount: post.likes.length,
    commentsCount: comments.length,
  };
}

// GET /api/posts — get all posts (feed), newest first
router.get('/', (req, res) => {
  const db = readDB();
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const sorted = [...db.posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(skip, skip + Number(limit));

  const enriched = sorted.map(p => enrichPost(p, db));
  res.json({ posts: enriched, total: db.posts.length, page: Number(page) });
});

// GET /api/posts/:id — single post
router.get('/:id', (req, res) => {
  const db = readDB();
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(enrichPost(post, db));
});

// GET /api/posts/user/:userId — posts by a specific user
router.get('/user/:userId', (req, res) => {
  const db = readDB();
  const posts = db.posts
    .filter(p => p.authorId === req.params.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(p => enrichPost(p, db));
  res.json({ posts });
});

// POST /api/posts — create new post (auth required)
router.post('/', authMiddleware, (req, res) => {
  const { content, image, tags } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Post content cannot be empty' });
  }

  const db = readDB();

  const newPost = {
    id: uuidv4(),
    authorId: req.userId,
    content: content.trim(),
    image: image || '',
    likes: [],
    comments: [],
    tags: tags || [],
    createdAt: new Date().toISOString(),
  };

  db.posts.unshift(newPost); // add to beginning
  writeDB(db);

  res.status(201).json(enrichPost(newPost, db));
});

// DELETE /api/posts/:id — delete post (only author can delete)
router.delete('/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const postIdx = db.posts.findIndex(p => p.id === req.params.id);

  if (postIdx === -1) return res.status(404).json({ error: 'Post not found' });
  if (db.posts[postIdx].authorId !== req.userId) {
    return res.status(403).json({ error: 'You can only delete your own posts' });
  }

  db.posts.splice(postIdx, 1);
  writeDB(db);
  res.json({ message: 'Post deleted successfully' });
});

// POST /api/posts/:id/like — toggle like on a post
router.post('/:id/like', authMiddleware, (req, res) => {
  const db = readDB();
  const post = db.posts.find(p => p.id === req.params.id);

  if (!post) return res.status(404).json({ error: 'Post not found' });

  const likeIdx = post.likes.indexOf(req.userId);
  if (likeIdx >= 0) {
    post.likes.splice(likeIdx, 1); // unlike
  } else {
    post.likes.push(req.userId);   // like
  }

  writeDB(db);
  res.json({ liked: likeIdx === -1, likesCount: post.likes.length, likes: post.likes });
});

module.exports = router;
