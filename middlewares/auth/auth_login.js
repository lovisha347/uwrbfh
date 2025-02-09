// middlewares/auth/auth_login.js
import jwt from 'jsonwebtoken';
import config from '../../config/config.js';

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '12345'
};

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authorization header missing' 
        });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token missing' 
        });
    }

    try {
        const decoded = jwt.verify(token, config.JWT.secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
};

export const admin_login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Username and password are required' 
        });
    }

    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials' 
        });
    }

    const token = jwt.sign(
        { username, role: 'admin' },
        config.JWT.secret,
        { expiresIn: config.JWT.expiresIn }
    );

    return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { username, role: 'admin' }
    });
};
