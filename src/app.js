const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// ✅ Import routes (make sure these files exist!)
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const feedRoutes = require('./routes/feed');
const adminRoutes = require('./routes/admin');

const app = express();

// ========== MIDDLEWARE ==========
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== ROUTES ==========
// Root route - shows API info
app.get('/', (req, res) => {
    res.json({ 
        message: 'Social Feed API', 
        version: '1.0.0',
        status: 'Running',
        documentation: 'Available at /health and /api/* endpoints',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            posts: '/api/posts',
            feed: '/api/feed',
            admin: '/api/admin',
            health: '/health'
        },
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        database: 'Connected', // You can add MongoDB connection check here
        uptime: process.uptime(),
        timestamp: new Date().toISOString() 
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/admin', adminRoutes);

// ========== ERROR HANDLING ==========
// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        message: 'Route not found',
        requestedUrl: req.originalUrl,
        availableEndpoints: {
            root: '/',
            health: '/health',
            api: {
                auth: '/api/auth',
                users: '/api/users',
                posts: '/api/posts',
                feed: '/api/feed',
                admin: '/api/admin'
            }
        }
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err.stack);
    res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        timestamp: new Date().toISOString()
    });
});

// ========== SERVER START ==========
const PORT = process.env.PORT || 3000;

// Only start server if this file is run directly (not when imported for tests)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`📡 Health check: http://localhost:${PORT}/health`);
        console.log(`🌐 API Root: http://localhost:${PORT}/`);
    });
}

module.exports = app;
