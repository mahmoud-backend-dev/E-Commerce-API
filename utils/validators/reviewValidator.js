const { check } = require('express-validator');
const validatorMiddleWare = require('../../middleware/validatorMiddleware');
const Review = require('../../models/Review');
const { BadRequest } = require('../../errors');


exports.createReviewValidator = [
    check('title').optional(),
    check('ratings')
        .notEmpty()
        .withMessage('Ratings value required')
        .isFloat({ min: 1, max: 5 })
        .withMessage("Ratings value must be between 1 to 5"),
    check("user").isMongoId().withMessage('Invalid User id format'),
    check("product")
        .isMongoId()
        .withMessage("Invalid Product id format")
        .custom(async (val, { req }) => {
            const review = await Review.findOne({
                user: req.user._id,
                product: val,
            });
            if (review)
                throw new BadRequest('You already created a review before');
            return true;
        }),
    validatorMiddleWare,
];

exports.getReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format'),
    validatorMiddleWare,
];

exports.updateReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format')
        .custom(async (val, { req }) => {
            // Check review ownership before update
            const review = await Review.findById(val)
            if (!review)
                throw new BadRequest(`There is no review with id ${val}`)
            if (review.user._id.toString() !== req.user._id.toString())
                throw new BadRequest("You are not allowed to perform this action")
            return true
        }),
    validatorMiddleWare,
];

exports.deleteReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format')
        .custom(async (val, { req }) => {
            // Check review ownership before update
            if (req.user.role === "user") {
                const review = await Review.findById(val)
                if (!review)
                    throw new BadRequest(`There is no review with id ${val}`)
                if (review.user._id.toString() !== req.user._id.toString())
                    throw new BadRequest("You are not allowed to perform this action")
            }
            return true
        }),
    validatorMiddleWare,
];
