const SubCategory = require('../models/SubCategory');
const {
    createOne,
    getOne,
    getAll,
    updateOne,
    deleteOne,
}=require('./handlerFactory')



// Nested Route
// POST  /api/v1/category/:categoryId/subcategories
exports.setCategoryIdToBody = (req, res, next) => { 
    if (req.params.categoryId)
        req.body.category = req.params.categoryId;
    next();
}

// Nested Route
// GET  /api/v1/categorios/:categoryId/subcategories
exports.createFilterObject = (req, res, next) => { 
    let filterObject = {};
    if (req.params.categoryId)
        filterObject = { category: req.params.categoryId };
    req.filterObject = filterObject;
    next();
}

// @desc Create SubCategory
// @route POST  /api/v1/subcategories
// @access private
exports.createSubCategory = createOne(SubCategory);


// @desc Get List Of SubCategories
// @route GET   /api/v1/subcategories
// @access public 
exports.getAllSubCategories = getAll(SubCategory);

// @desc  Get Specific SubCategory by id
// @route GET   /api/v1/subcategories/:id
// @access private
exports.getSubGategory = getOne(SubCategory);


// @desc  Get Specific SubCategory by id
// @route GET   /api/v1/subcategories/:id
// @access private
exports.updateSubCategory = updateOne(SubCategory);

// @desc  Delete Specific SubCategory by id
// @route DELETE   /api/v1/subcategories/:id
// @access private
exports.deleteSubCategory = deleteOne(SubCategory);



