const { check } = require('express-validator');
const slugify = require('slugify');
const validatorMiddleWare = require('../../middleware/validatorMiddleware');


exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleWare,
];

exports.createCategoryValidator = [
    check('name').notEmpty().withMessage('Category required')
        .isLength({ min: 3 }).withMessage('Too short category name ')
        .isLength({ max: 32 }).withMessage('Too long category name ')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true
        }),
    validatorMiddleWare,
];

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    check('name').optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
    }),
    validatorMiddleWare,
];

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleWare,
];
