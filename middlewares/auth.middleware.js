import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { APIError } from './error.middleware.js';

export const generateToken = (username) => {
  return jwt.sign({ username }, config.JWT.secret, {
    expiresIn: config.JWT.expiresIn
  });
};

export const verifyAdminCredentials = (username, password) => {
  return username === config.ADMIN.username && password === config.ADMIN.password;
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new APIError(401, 'Authentication token is required');
  }

  try {
    const decoded = jwt.verify(token, config.JWT.secret);
    req.user = decoded;
    next();
  } catch (err) {
    throw new APIError(403, 'Invalid or expired token');
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.username !== config.ADMIN.username) {
    throw new APIError(403, 'Admin access required');
  }
  next();
};
