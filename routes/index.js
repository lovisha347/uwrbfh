// src/routes/index.js
import { Router } from 'express';
import constantsRoutes from './api.constants.js';
import commentsRoutes from './api.comments.js';
import progressRoutes from './api.progess.js';
import bannerRoutes from './api.banner.js'
import { authenticate, admin_login } from '../middlewares/auth/auth_login.js';
import express from 'express';
import { authenticateToken, verifyAdminCredentials, generateToken, requireAdmin } from '../middlewares/auth.middleware.js';
import { APIError } from '../middlewares/error.middleware.js';
import banner from '../banner.js';

const router = Router();

// API routes
router.use('/api/constants', constantsRoutes);
router.use('/api/comments', commentsRoutes);
router.use('/api/progress', progressRoutes);
router.use('/api/banner', bannerRoutes);

// Admin routes
router.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new APIError(400, 'Username and password are required');
  }

  if (!verifyAdminCredentials(username, password)) {
    throw new APIError(401, 'Invalid credentials');
  }

  const token = generateToken(username);
  res.json({ token });
});

router.get('/api/admin/verify', authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: 'Admin authenticated successfully' });
});

router.post('/admin/auth', authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Catch-all route for undefined API endpoints
router.all('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.path
  });
});

export default router;
