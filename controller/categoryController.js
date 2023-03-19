const Category = require('../models/Category');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleWare');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const {
    createOne,
    getOne,
    getAll,
    updateOne,
    deleteOne,
}=require('./handlerFactory');


// Upload Single Image
exports.uploadCategoryImage = uploadSingleImage("image");

//  Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 97 })
        .toFile(`uploads/categories/${filename}`);
    //  set image to body
    req.body.image = filename;
    }
    next();
})



// @desc Create Category
// @route POST  /api/v1/categories
// @access private
exports.createCategory = createOne(Category);

// @desc Get List Of Categories
// @route GET   /api/v1/categories
// @access public 
exports.getAllCategories = getAll(Category);

// @desc  Get Specific Category by id
// @route GET   /api/v1/categories/:id
// @access private
exports.getGategory = getOne(Category);


// @desc  Get Specific Category by id
// @route GET   /api/v1/categories/:id
// @access private
exports.updateCategory = updateOne(Category);

// @desc  Delete Specific Category by id
// @route DELETE   /api/v1/categories/:id
// @access private
exports.deleteCategory = deleteOne(Category);

