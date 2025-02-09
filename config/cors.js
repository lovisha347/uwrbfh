// config/cors.js
export const corsOptions = {
    origin: process.env.CORS_ORIGINS.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  