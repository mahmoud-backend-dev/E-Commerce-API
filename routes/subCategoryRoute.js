const express = require('express');
// allow us to access params from ather routes
const router = express.Router({mergeParams:true});

const {
    getSubGategory,
    createSubCategory,
    getAllSubCategories,
    updateSubCategory,
    deleteSubCategory,
    setCategoryIdToBody,
    createFilterObject,
} = require('../controller/subCategoryController');

const {
    protect,
    allowedTo,
} = require('../controller/authController')

const {
    createCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator
} = require('../utils/validators/subCategoryValidator');

router.route('/')
    .post(
        protect,
        allowedTo("manager","admin"),
        setCategoryIdToBody,
        (req, res, next) => {
            console.log("Ok");
            next()
        },
        createCategoryValidator,
        createSubCategory)
    .get(createFilterObject, getAllSubCategories);
router.route('/:id')
    .get(getSubCategoryValidator, getSubGategory)
    .put(
        protect,
        allowedTo("manager","admin"),
        updateSubCategoryValidator,
        updateSubCategory)
    .delete(
        protect,
        allowedTo("admin"),
        deleteSubCategoryValidator,
        deleteSubCategory);


module.exports = router;