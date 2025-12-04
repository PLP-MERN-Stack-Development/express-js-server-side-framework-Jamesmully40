const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const logger = require('./middleware/logger');

// Middleware
app.use(bodyParser.json());
app.use(logger);

const errorHandler = require('./middleware/errorHandler');

// Routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
