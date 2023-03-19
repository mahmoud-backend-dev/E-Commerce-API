const Brand = require('../models/Brand');
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
}=require('./handlerFactory')



// Upload Single Image
exports.uploadBrandImage = uploadSingleImage("image");

//  Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 97 })
        .toFile(`uploads/brands/${filename}`);
    //  set image to body
    req.body.image = filename;
    }
    next();
})

// @desc Create Brand
// @route POST  /api/v1/brands
// @access private
exports.createBrand = createOne(Brand);

// @desc Get List Of Brand
// @route GET   /api/v1/brands
// @access public 
exports.getAllBrands = getAll(Brand);

// @desc  Get Specific Brand by id
// @route GET   /api/v1/brands/:id
// @access private
exports.getBrand = getOne(Brand);


// @desc  Get Specific Brand by id
// @route GET   /api/v1/brands/:id
// @access private
exports.updateBrand = updateOne(Brand);

// @desc  Delete Specific Brand by id
// @route DELETE   /api/v1/brands/:id
// @access private
exports.deleteBrand = deleteOne(Brand);


