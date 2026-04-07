require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { testConnection } = require('./config/database');
const { initModels } = require('./models');

const adminRoutes = require('./routes/adminRoutes');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Inventory API Server',
    version: '1.0.0',
    framework: 'Express.js + Sequelize',
    autoDatabase: true,
    endpoints: {
      auth: '/api/auth',
      items: '/api/items'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// Start server with auto database creation
const startServer = async () => {
  try {
    // This will automatically create database if not exists
    await testConnection();
    
    // Initialize models and associations
    await initModels();
    
    console.log('✅ Models initialized successfully');
    
    // Note: We're not using sequelize.sync() because we use migrations
    // But if you want to auto-create tables (for development only):
    if (process.env.NODE_ENV === 'development' && process.env.AUTO_SYNC === 'true') {
      const { sequelize } = await require('./models').getModels();
      await sequelize.sync({ alter: true });
      console.log('⚠️  Tables auto-synced (development mode only)');
    }
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📦 API Base URL: http://localhost:${PORT}/api`);
      console.log(`💾 Auto database creation: ENABLED`);
      console.log(`\n✨ Ready to accept requests!\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;