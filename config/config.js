// config/config.js
const config = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGINS: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : ["https://dezzy.live"],
  RATE_LIMIT: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: { error: 'Too many requests, please try again later.' }
  },
  SESSION: {
    secret: process.env.SESSION_SECRET || (process.env.NODE_ENV === 'production' ? undefined : 'dev-secret-key'),
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    }
  },
  JWT: {
    secret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? undefined : 'dev-jwt-secret'),
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  SOCKET: {
    pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 20000,
    pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000,
    upgradeTimeout: parseInt(process.env.SOCKET_UPGRADE_TIMEOUT) || 10000,
    maxHttpBufferSize: parseInt(process.env.SOCKET_MAX_HTTP_BUFFER_SIZE) || 1e6 // 1MB
  },
  ADMIN: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin12345'
  }
};

// Validate required configuration in production
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = ['SESSION_SECRET', 'JWT_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
}

export default config;