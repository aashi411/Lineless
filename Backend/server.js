import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import invoiceRoutes from './src/routes/invoiceRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',           // Local Vite frontend
  'http://localhost:3000',           // Alt local port
  process.env.FRONTEND_URL || ''     // Production frontend URL from .env
].filter(url => url); // Remove empty strings

console.log('[Server] Allowed Origins:', allowedOrigins);

// Middleware - CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/invoices', invoiceRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Invoice Generation API', version: '1.0.0' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
