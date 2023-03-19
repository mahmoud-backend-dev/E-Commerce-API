const { check, body } = require('express-validator');
const slugify = require('slugify');
const { BadRequest, NotFoundError } = require('../../errors');
const validatorMiddleWare = require('../../middleware/validatorMiddleware');
const UserModel = require('../../models/User');



exports.signupValidator = [
    check('name').notEmpty().withMessage('User name required')
        .isLength({ min: 3 }).withMessage('Too short User name ')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('email').notEmpty().withMessage('Email required')
        .isEmail().withMessage('Invalid email address ')
        .custom(async (val) => {
            const user = await UserModel.findOne({ email: val });
            if (user)
                throw new BadRequest('E-mail already in used')
            else
                return true
        }),
    check('password').notEmpty().withMessage('Password required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .custom((pass, { req }) => {
            if (pass !== req.body.passwordConfirm)
                throw new BadRequest('Password Confirmation incorrect')
            return true;
        }),
    validatorMiddleWare,
];

exports.loginValidator = [
    check('email').notEmpty().withMessage('Email required')
        .isEmail().withMessage('Invalid email address '),
    body('password').notEmpty().withMessage('Password required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    validatorMiddleWare,
]

