const auth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    // For simplicity, we'll use a hardcoded API key 'secret-api-key'
    // In a real app, this should come from environment variables
    if (!apiKey || apiKey !== 'secret-api-key') {
        return res.status(401).json({ message: 'Unauthorized: Invalid or missing API Key' });
    }

    next();
};

module.exports = auth;
