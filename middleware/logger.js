// Middleware to log the endpoint, HTTP method, and timestamp
const requestLogger = (req, res, next) => {
    const currentTime = new Date().toISOString(); // Get current timestamp in ISO format
    const method = req.method; // Get HTTP method
    const endpoint = req.originalUrl; // Get the requested endpoint

    // Log the details
    console.log(`[${currentTime}] ${method} ${endpoint}`);
    // Pass control to the next middleware or route
    next();
};

module.exports = { requestLogger }
