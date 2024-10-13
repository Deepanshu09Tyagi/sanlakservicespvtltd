const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';  // Same secret key used to sign the JWT
const User = require("../models/userModel")

const userAuth = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, "JWT_SECRET");
        req.user = decoded;  // Attach user ID to the request object
        next();  // Continue to the next middleware or route handler
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
}

const adminAuth = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, "JWT_SECRET");
        req.user = decoded;  // Attach user ID to the request object

        // Fetch the user from the database to check their role
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Only Admins can create Users.' });
        }

        next();  // If the user is an admin, proceed to the next middleware/route handler
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = { userAuth, adminAuth }