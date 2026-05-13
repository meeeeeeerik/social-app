// ============================================================
// 🚀 Social App — Simple Node.js + Express Backend
// ============================================================
// This is a beginner-friendly REST API server.
// It uses a JSON file (db.json) as the database — no SQL needed!
//
// HOW IT WORKS:
//   1. Client sends HTTP request (GET/POST/PUT/DELETE)
//   2. Express router matches the URL to the right handler
//   3. Handler reads/writes db.json
//   4. Handler sends JSON response back to client
//
// ENDPOINTS:
//   POST   /api/auth/register     — create account
//   POST   /api/auth/login        — login, get token
//   GET    /api/auth/me           — get my profile
//
//   GET    /api/posts             — get all posts (feed)
//   POST   /api/posts             — create post
//   DELETE /api/posts/:id         — delete post
//   POST   /api/posts/:id/like    — like/unlike post
//   GET    /api/posts/user/:id    — posts by user
//
//   POST   /api/comments          — add comment
//   DELETE /api/comments/:id      — delete comment
//
//   GET    /api/users             — get all users
//   GET    /api/users/:id         — get user profile
//   PUT    /api/users/me          — update my profile
//   POST   /api/users/:id/follow  — follow/unfollow
//   GET    /api/users/:id/suggestions — who to follow
//
//   GET    /api/stories           — get stories
// ============================================================

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ───────────────────────────────────────────────
// Parse JSON bodies from requests
app.use(express.json());

// Allow requests from our React frontend (localhost:5173)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Simple request logger — great for debugging
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/posts',    require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/stories',  require('./routes/stories'));

// Health check endpoint — useful to test if server is running
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Social App API is running! 🚀',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler — when no route matches
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler — catches any unexpected errors
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  🚀 Social App Server started!');
  console.log(`  📡 API running at: http://localhost:${PORT}`);
  console.log(`  ✅ Health check:   http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('  Demo accounts (password: "password"):');
  console.log('    alex@demo.com');
  console.log('    sarah@demo.com');
  console.log('    marcus@demo.com');
  console.log('');
});
