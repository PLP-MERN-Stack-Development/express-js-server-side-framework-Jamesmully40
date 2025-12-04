const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

// Apply auth middleware to all product routes
router.use(auth);

router.get('/', productController.getAllProducts);
router.get('/stats', productController.getProductStats);
router.get('/:id', productController.getProductById);
router.post('/', validateProduct, productController.createProduct);
router.put('/:id', validateProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
