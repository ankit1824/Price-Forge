require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Routes will be imported here
// app.use('/api/auth', require('./src/routes/auth'));
// app.use('/api/search', require('./src/routes/search'));
// app.use('/api/cart', require('./src/routes/cart'));
// app.use('/api/favorites', require('./src/routes/favorites'));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
