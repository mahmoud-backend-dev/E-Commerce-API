const express = require('express');
const {
    createCategory,
    getAllCategories,
    getGategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    resizeImage,
} = require('../controller/categoryController');
const router = express.Router();
const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
} = require('../utils/validators/categoryValidator');
const {
    protect,
    allowedTo,
} = require('../controller/authController')
const subCategoryRoute = require('./subCategoryRoute');

router.use('/:categoryId/subcategories', subCategoryRoute);
router.route('/')
    .get(getAllCategories)
    .post(
        protect,
        allowedTo("manager","admin"),
        uploadCategoryImage,
        resizeImage,
        createCategoryValidator,
        createCategory);
router.route('/:id')
    .get(getCategoryValidator, getGategory)
    .put(
        protect,
        allowedTo("manager","admin"),
        uploadCategoryImage,
        resizeImage,
        updateCategoryValidator,
        updateCategory)
    .delete(
        protect,
        allowedTo("admin"),
        deleteCategoryValidator,
        deleteCategory);

module.exports = router