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
  protect,
  allowedTo,
} = require('../controller/authController');
router.use(protect);

router.get('/checkout-session/:cartId', allowedTo('user'), checkoutSession);

router
  .route('/:cartId')
  .post(allowedTo('user'), createCashOrder);

router
  .get('/', allowedTo('admin', 'manager', 'user'), filterOrderForLoggedUser, getAllOrders);

router
  .get('/:id', getSpecificOrder);

router
  .put('/:id/pay', allowedTo('admin', 'manager'), updateOrderToPaid);

router
  .put('/:id/deliver', allowedTo('admin', 'manager'), updateOrderToDelivered);

module.exports = router;