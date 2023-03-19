const express = require('express');
const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    uploadProductsImages,
    resizeProductsImages,
} = require('../controller/productController');
const router = express.Router();
const {
    protect,
    allowedTo,
} = require('../controller/authController')
const {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require('../utils/validators/productValidator');

const reviewRoute = require('./reviewRoute');

// Access Nested Route
// POST products/54546ad43sa8das5das/reviews
// GET products/54546ad43sa8das5das/reviews
// GET products/54546ad43sa8das5das/reviews/sdaas55656658646sda
router.use('/:productId/reviews', reviewRoute);

router.route('/')
    .get(getAllProducts)
    .post(
        protect,
        allowedTo("manager","admin"),
        uploadProductsImages,
        resizeProductsImages,
        createProductValidator,
        createProduct);
router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(
        protect,
        allowedTo("manager","admin"),
        uploadProductsImages,
        resizeProductsImages,
        updateProductValidator,
        updateProduct)
    .delete(
        protect,
        allowedTo("admin"),
        deleteProductValidator,
        deleteProduct);

module.exports = router