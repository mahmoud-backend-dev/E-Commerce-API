const Product = require('../models/Product');
const { uploadMixOfImages } = require('../middleware/uploadImageMiddleWare');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const {
    createOne,
    getOne,
    getAll,
    updateOne,
    deleteOne,
} = require('./handlerFactory')

// Upload Products Images
exports.uploadProductsImages = uploadMixOfImages([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 }
]);

//Image Processing
exports.resizeProductsImages = asyncHandler(async (req, res, next) => {

    // 1) Image Processing for imageCover
    if (req.files.imageCover) {
        const imageCoverFilename = `products-${uuidv4()}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 97 })
            .toFile(`uploads/products/${imageCoverFilename}`);
        // set imageCove to body
        req.body.imageCover = imageCoverFilename;
    }

    // 2) Image Processing for imageCover
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(req.files.images.map(async (image, index) => {
            const imageName = `products-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
            await sharp(image.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 97 })
                .toFile(`uploads/products/${imageName}`);
            // set imageCove to body
            req.body.images.push(imageName);
        }))
    };
    next();
})

// @desc Create Product
// @route POST  /api/v1/products
// @access private
exports.createProduct = createOne(Product);

// @desc Get List Of Product
// @route GET   /api/v1/products
// @access public 
exports.getAllProducts = getAll(Product, "Products");

// @desc  Get Specific Brand by id
// @route GET   /api/v1/categories/:id
// @access private
exports.getProduct = getOne(Product, "reviews");


// @desc  Get Specific Product by id
// @route GET   /api/v1/products/:id
// @access private
exports.updateProduct = updateOne(Product);

// @desc  Delete Specific Product by id
// @route DELETE   /api/v1/products/:id
// @access private
exports.deleteProduct = deleteOne(Product);

