const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const emiRoutes = require('./routes/emiRoutes');
const testRoutes = require('./routes/testRouter');
const billingRoutes = require('./routes/billingRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/emi', emiRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  const db = require('./config/db.config');
  try {
    const [patientCount] = await db.query('SELECT COUNT(*) as count FROM patients');
    res.json({ 
      status: 'OK', 
      message: 'Backend running with DATABASE',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      stats: {
        patients: patientCount[0].count
      }
    });
  } catch (error) {
    res.json({ 
      status: 'OK', 
      message: 'Backend running but database error',
      timestamp: new Date().toISOString(),
      database: 'Error',
      error: error.message
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    url: req.originalUrl
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('');
  console.log('🌟 ================================');
  console.log('🌟 SERVER RUNNING!');
  console.log('🌟 ================================');
  console.log(`� Se=rver URL: http://localhost:${PORT}`);
  console.log('');
  console.log('�  CREDENTIALS:');
  console.log('   📧 Username: admin | Password: admin123');
  console.log('   📧 Email: test@lab.com | Password: Test@123');
  console.log('');
  console.log('✨ All endpoints connected to DATABASE!');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', err);
  }
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
