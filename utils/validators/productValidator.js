const { check } = require('express-validator');
const { BadRequest } = require('../../errors');
const validatorMiddleWare = require('../../middleware/validatorMiddleware');
const Category = require('../../models/Category');
const SubCategory = require('../../models/SubCategory');
const slugify = require('slugify');

exports.getProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id format'),
    validatorMiddleWare,
];

exports.createProductValidator = [
    check('title').notEmpty().withMessage('Product title required')
        .isLength({ min: 3 }).withMessage('Too short product title ')
        .isLength({ max: 100 }).withMessage('Too long product title ')
        .custom((val, { req }) => {
            req.body.slug = slugify(val)
            return true;
        }),
    check('description').notEmpty().withMessage('Product description required')
        .isLength({ min: 20 }).withMessage('Too short product description')
        .isLength({ max: 2000 }).withMessage('Too long product description'),
    check('quantity').notEmpty().withMessage('Product quantity is required')
        .isNumeric().withMessage('Product quantity must be a number'),
    check('sold').optional().isNumeric().withMessage('Product quantity must be a number'),
    check('price').notEmpty().withMessage('Product price is required')
        .isNumeric().withMessage('Product price must be a number')
        .isLength({ max: 32 }).withMessage('Too long product price'),
    check('priceAfterDiscount')
        .optional()
        .isNumeric().withMessage('Product priceAfterDiscount must be a number')
        .toFloat()
        .custom((val, { req }) => {
            if (req.body.price <= val)
                throw new BadRequest('priceAfterDiscount must be lowar than price')
            return true;
        }),
    check('colors')
        .optional().isAfter().withMessage('Colors should be array od string'),
    check('imageCover').notEmpty().withMessage('Product image cover is required'),
    check('images').optional().isArray().withMessage('Images should be array of string'),
    check('category')
    .notEmpty()
    .withMessage('Product must be belong to a category')
    .isMongoId()
    .withMessage('Invalid ID formate')
        .custom(async (categoryId) => {
            const category = await Category.findById(categoryId);
            if (category)
                return true;
            else
                throw new BadRequest(`No category for this id: ${categoryId}`)
        }),

    check('subcategories')
    .optional()
    .isMongoId()
        .withMessage('Invalid ID formate')
        .custom(async (subcategoriesIds) => {
            const subCategories = await SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } });
            if (subCategories.length < 1 || subCategories.length !== subcategoriesIds.length)
                throw new BadRequest('Invalid subcategories Ids ')
        })
        .custom(async (val,{req}) => {
            const subCategories = await SubCategory.find({ category: req.body.category });
            let subcategoriesIds = [];
            subCategories.forEach((ele) => {
                subcategoriesIds.push(ele._id.toString());
            })
            const cheaker = (target, arr) => target.every((v) => arr.includes(v));
            console.log(cheaker(val, subcategoriesIds));
            if (!cheaker(val, subcategoriesIds))
                throw new BadRequest('subcategories not belong to category');
    })
    ,
    check('brand').optional().isMongoId().withMessage('Invalid ID formate'),  
    check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('ratingsAverage must be a number')
    .isLength({ min: 1 })
    .withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 })
    .withMessage('Rating must be below or equal 5.0'),
    check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('ratingsQuantity must be a number'),
    validatorMiddleWare,
];

exports.updateProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id format'),
    check('title').optional()
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true
    }),
    validatorMiddleWare,
];

exports.deleteProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id format'),
    validatorMiddleWare,
];
