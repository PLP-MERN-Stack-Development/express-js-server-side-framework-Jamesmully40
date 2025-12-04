const { v4: uuidv4 } = require('uuid');

let products = [
    {
        id: uuidv4(),
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
        category: 'Electronics',
        inStock: true
    },
    {
        id: uuidv4(),
        name: 'Coffee Mug',
        description: 'Ceramic coffee mug',
        price: 12.50,
        category: 'Kitchen',
        inStock: true
    }
];

module.exports = products;
