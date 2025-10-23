import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection, closePool } from './config/database';
import { cleanupExpiredSessions } from './utils/jwt';

// Import routes
import authRoutes from './routes/authRoutes';
import applicationRoutes from './routes/applicationRoutes';
import uploadRoutes from './routes/uploadRoutes';
import goodsamRoutes from './routes/goodsamRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BGF Aid System API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// API routes
const apiRouter = express.Router();

// Test route
apiRouter.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
apiRouter.use('/auth', authRoutes);

// Application routes
apiRouter.use('/applications', applicationRoutes);

// GoodSam Network routes
apiRouter.use('/goodsam', goodsamRoutes);

// Upload routes
apiRouter.use('/', uploadRoutes);

// Mount API routes
app.use('/api/v1', apiRouter);

// 404 handler - will catch any unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n📨 ${signal} received`);
  console.log('🔄 Gracefully shutting down...');
  
  try {
    await closePool();
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    console.log('✅ Database connection established');
    
    // Start cleanup job for expired sessions (every hour)
    setInterval(async () => {
      try {
        await cleanupExpiredSessions();
        console.log('🧹 Expired sessions cleaned up');
      } catch (error) {
        console.error('Error cleaning up expired sessions:', error);
      }
    }, 60 * 60 * 1000); // 1 hour

    // Start the server
    const server = app.listen(PORT, () => {
      console.log('🚀 BGF Aid System API Server Started');
      console.log('📍 Environment:', NODE_ENV);
      console.log('🌐 Server running on port:', PORT);
      console.log('🔗 API Base URL:', `http://localhost:${PORT}/api/v1`);
      console.log('📊 Health Check:', `http://localhost:${PORT}/health`);
      console.log('🔐 Auth Endpoints:', `http://localhost:${PORT}/api/v1/auth`);
      console.log('📋 Application Endpoints:', `http://localhost:${PORT}/api/v1/applications`);
      console.log('📁 Upload Endpoints:', `http://localhost:${PORT}/api/v1/applications/:id/files`);
      console.log('⏰ Started at:', new Date().toISOString());
    });

    // Set server timeout (30 seconds)
    server.timeout = 30000;
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export default app;