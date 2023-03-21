const { check } = require('express-validator');
const validatorMiddleWare = require('../../middleware/validatorMiddleware');
const slugify = require('slugify');
const Category = require('../../models/Category');
const { BadRequest } = require('../../errors');

exports.createCategoryValidator = [
    check('name').notEmpty().withMessage('Category name required')
        .isLength({ min: 2 }).withMessage('Too short category name ')
        .isLength({ max: 32 }).withMessage('Too long category name ')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
    }),
    check('category').notEmpty().withMessage('Category id required')
        .isMongoId().withMessage('Invalid category id format')
        .custom(async (val) => {
            const category = await Category.findById(val);
            if (!category)
                throw new BadRequest(`There is no such category with id: ${val}`)
            return true;
        }),
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
    check('category').custom(async (val) => {
        const category = await Category.findById(val);
        if (!category)
            throw new BadRequest(`There is no such category with id: ${val}`)
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
