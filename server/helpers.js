// helpers.js — utilities for reading and writing to our JSON database
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// Read the entire database
function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

// Write the entire database back to disk
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Remove sensitive fields from user object before sending to client
function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

module.exports = { readDB, writeDB, sanitizeUser };
