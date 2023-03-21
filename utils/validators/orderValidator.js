const { check } = require('express-validator');
const validatorMiddleWare = require('../../middleware/validatorMiddleware');



exports.createOrderValidator = [
    check('cartId').isMongoId().withMessage('Invalid cart id'),
    check('shippingAddress.phone').optional().isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone number only accepted Egy and SA phone numbers'),
    validatorMiddleWare,
];

exports.checkoutSessionValidator = [
  check('cartId').notEmpty().withMessage('Cart id required in params with URL')
    .isMongoId().withMessage('Invalid cart id'),
  check('shippingAddress.phone').optional().isMobilePhone(['ar-EG', 'ar-SA'])
      .withMessage('Invalid phone number only accepted Egy and SA phone numbers'),
  validatorMiddleWare,
]