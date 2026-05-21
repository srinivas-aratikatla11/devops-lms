// ─────────────────────────────────────────────
//  server.js — Entry point for the LMS backend
//  Run with:  node backend/server.js
//  Dev mode:  npm run dev  (uses nodemon)
// ─────────────────────────────────────────────

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ── Middleware ─────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve the frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ── API Routes ─────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/courses',     require('./routes/courses'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/announcements', require('./routes/announcements'));

// ── Catch-all: send frontend for any unknown route ─
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Connect to MongoDB then start server ───────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devopslms';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    if (MONGO_URI.startsWith('mongodb+srv://')) {
      console.error('   • If you are using Atlas, verify your IP is allowed and DNS/SRV lookups work.');
      console.error('   • Confirm that the Atlas cluster is running and the connection string is correct.');
    } else {
      console.error('   • Ensure local MongoDB is running on mongodb://127.0.0.1:27017');
    }
    process.exit(1);
  });
