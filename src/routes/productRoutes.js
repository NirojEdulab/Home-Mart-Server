const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// const upload = require('../middleware/multerConfig');

// Route to add a new product
router.post('/products', productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/searchProducts', productController.searchProducts);
router.delete('/product/:id', productController.deleteProduct);

module.exports = router;
