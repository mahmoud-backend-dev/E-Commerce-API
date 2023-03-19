const { check, body } = require('express-validator');
const slugify = require('slugify');
const { BadRequest, NotFoundError } = require('../../errors');
const validatorMiddleWare = require('../../middleware/validatorMiddleware');
const bcrypt = require('bcryptjs');
const UserModel = require('../../models/User');



exports.createUserValidator = [
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
    check('passwordConfirm').notEmpty().withMessage('passwordConfirm required'),
    check('phone').optional().isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone number only accepted Egy and SA phone numbers'),
    
    check('profileImg').optional(),
    check('role').optional(),
    validatorMiddleWare,
];

exports.changeUserPasswordValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    body("currentPassword")
        .notEmpty()
        .withMessage('You must enter your current password'),
    body('passwordConfirm')
        .notEmpty()
        .withMessage('You must enter your  password confirm'),
    body('password')
        .notEmpty()
        .withMessage('You must enter new password')
        .custom(async (val, { req }) => {
            // 1) Verify user found or not  
            const user = await UserModel.findById(req.params.id);
            if (!user)
                throw new NotFoundError(`Not found user for this id ${req.params.id}`);
            // 2) Verify current password 
            const isMatchPass = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isMatchPass)
                throw new BadRequest('Current Password incorrect'); 
            // 3) Verify Confirm Password
            if (req.body.passwordConfirm !== val)
                throw new BadRequest('Confirm Password incorrect')
            return true
        }),
    validatorMiddleWare,
]

exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleWare,
];

exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    check('name').optional()
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('email').optional().notEmpty().withMessage('Email required')
    .isEmail().withMessage('Invalid email address ')
    .custom(async (val) => {
        const user = await UserModel.findOne({ email: val });
        if (user)
            throw new BadRequest('E-mail already in used')
        else
            return true
    }),
    check('phone').optional().isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA phone numbers'),

    check('profileImg').optional(),
    check('role').optional(),
    validatorMiddleWare,
];

exports.updateLoggedUserValidator = [
    check('name').optional()
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('email').optional().notEmpty().withMessage('Email required')
    .isEmail().withMessage('Invalid email address ')
    .custom(async (val) => {
        const user = await UserModel.findOne({ email: val });
        if (user)
            throw new BadRequest('E-mail already in used')
        else
            return true
    }),
    check('phone').optional().isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA phone numbers'),
    validatorMiddleWare,
];

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleWare,
];
