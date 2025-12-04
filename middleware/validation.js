const validateProduct = (req, res, next) => {
    const { name, price, category } = req.body;
    const isUpdate = req.method === 'PUT';

    if ((!isUpdate && !name) || (name && typeof name !== 'string')) {
        return res.status(400).json({ message: 'Validation Error: Name is required and must be a string' });
    }

    if ((!isUpdate && price === undefined) || (price !== undefined && (typeof price !== 'number' || price < 0))) {
        return res.status(400).json({ message: 'Validation Error: Price is required and must be a non-negative number' });
    }

    if ((!isUpdate && !category) || (category && typeof category !== 'string')) {
        return res.status(400).json({ message: 'Validation Error: Category is required and must be a string' });
    }

    next();
};

module.exports = { validateProduct };
