// middlewares/security.js
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import config from '../config/config.js';

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT.windowMs,
  max: config.RATE_LIMIT.max,
  message: config.RATE_LIMIT.message,
  standardHeaders: true,
  legacyHeaders: false
});

// CORS configuration
const corsOptions = {
  origin: config.CORS_ORIGINS,
  methods: ['GET', 'POST'],
  credentials: true,
  maxAge: 86400, // 24 hours
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Security middleware array
export const securityMiddleware = [
  // Helmet security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", ...config.CORS_ORIGINS],
        fontSrc: ["'self'", 'https:', 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' },
    xssFilter: true
  }),

  // CORS
  cors(corsOptions),

  // Rate limiting
  limiter,

  // Additional security measures
  (req, res, next) => {
    // Remove sensitive headers
    res.removeHeader('X-Powered-By');
    
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    next();
  }
];
