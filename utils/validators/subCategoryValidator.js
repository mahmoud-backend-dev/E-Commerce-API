const { check } = require('express-validator');
const validatorMiddleWare = require('../../middleware/validatorMiddleware');
const slugify = require('slugify');

exports.createCategoryValidator = [
    check('name').notEmpty().withMessage('Category required')
        .isLength({ min: 2 }).withMessage('Too short category name ')
        .isLength({ max: 32 }).withMessage('Too long category name ')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
    }),
    check('category').notEmpty().withMessage('Subcategory required')
        .isMongoId().withMessage('Invalid category id format'),
    validatorMiddleWare,
];

exports.updateSubCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid category id format'),
        check('name').optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
    }),
    validatorMiddleWare,
];

exports.deleteSubCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid category id format'),
    validatorMiddleWare,
];

exports.getSubCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid category id format'),
    validatorMiddleWare,
];
