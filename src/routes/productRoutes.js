const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/multerConfig');

// Route to add a new product
router.post('/products', upload.single("file"), productController.createProduct);
router.get('/products', productController.getAllProducts);

module.exports = router;
