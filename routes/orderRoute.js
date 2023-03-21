const express = require('express');
const router = express.Router();
const {
  createCashOrder,
  filterOrderForLoggedUser,
  getSpecificOrder,
  getAllOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
  checkoutSession,
} = require('../controller/orderController');

const {
  createOrderValidator,
  checkoutSessionValidator,
} = require('../utils/validators/orderValidator');

const {
  protect,
  allowedTo,
} = require('../controller/authController');
router.use(protect);

router.post(
  '/checkout-session/:cartId',
  allowedTo('user'),
  checkoutSessionValidator,
  checkoutSession
);

router
  .route('/:cartId')
  .post(
    allowedTo('user'),
    createOrderValidator,
    createCashOrder,
);

router
  .get('/', allowedTo('admin', 'manager', 'user'), filterOrderForLoggedUser, getAllOrders);

router
  .get('/:id', getSpecificOrder);

router
  .put('/:id/pay', allowedTo('admin', 'manager'), updateOrderToPaid);

router
  .put('/:id/deliver', allowedTo('admin', 'manager'), updateOrderToDelivered);

module.exports = router;