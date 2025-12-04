const { v4: uuidv4 } = require('uuid');
let products = require('../data/products');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// GET /api/products
exports.getAllProducts = catchAsync(async (req, res, next) => {
    let result = [...products];

    // 1. Filtering by category
    if (req.query.category) {
        result = result.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
    }

    // 2. Search by name
    if (req.query.search) {
        const searchTerm = req.query.search.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    // 3. Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = result.length;
    const paginatedResults = result.slice(startIndex, endIndex);

    res.json({
        status: 'success',
        results: paginatedResults.length,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        data: paginatedResults
    });
});

// GET /api/products/stats
exports.getProductStats = catchAsync(async (req, res, next) => {
    const stats = products.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
    }, {});

    res.json({
        status: 'success',
        data: {
            countByCategory: stats,
            totalProducts: products.length
        }
    });
});

// GET /api/products/:id
exports.getProductById = catchAsync(async (req, res, next) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    res.json(product);
});

// POST /api/products
exports.createProduct = catchAsync(async (req, res, next) => {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
        id: uuidv4(),
        name,
        description,
        price,
        category,
        inStock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PUT /api/products/:id
exports.updateProduct = catchAsync(async (req, res, next) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return next(new AppError('Product not found', 404));
    }

    const { name, description, price, category, inStock } = req.body;
    products[index] = {
        ...products[index],
        name: name || products[index].name,
        description: description || products[index].description,
        price: price || products[index].price,
        category: category || products[index].category,
        inStock: inStock !== undefined ? inStock : products[index].inStock
    };

    res.json(products[index]);
});

// DELETE /api/products/:id
exports.deleteProduct = catchAsync(async (req, res, next) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return next(new AppError('Product not found', 404));
    }

    products.splice(index, 1);
    res.status(204).send();
});
