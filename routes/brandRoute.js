const express = require('express');
const {
    createBrand,
    getAllBrands,
    getBrand,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    resizeImage,
} = require('../controller/brandController');
const router = express.Router();
const {
    protect,
    allowedTo,
} = require('../controller/authController')
const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
} = require('../utils/validators/brandValidator');




router.route('/')
    .get(getAllBrands)
    .post(
        protect,
        allowedTo("manager","admin"),
        uploadBrandImage,
        resizeImage,
        createBrandValidator,
        createBrand);
router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(
        protect,
        allowedTo("manager","admin"),
        uploadBrandImage,
        resizeImage,
        updateBrandValidator,
        updateBrand)
    .delete(
        protect,
        allowedTo("admin"),
        deleteBrandValidator,
        deleteBrand);

module.exports = router