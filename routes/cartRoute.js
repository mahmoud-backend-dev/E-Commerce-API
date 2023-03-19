const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const {
  protect,
  allowedTo,
} = require('../controller/authController')
const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon
} = require('../controller/cartController');



router.use(protect, allowedTo('user'));

router
  .route('/')
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart)

  router.put('/applyCoupon', applyCoupon)

router.route('/:itemId')
  .delete(removeSpecificCartItem)
  .put(updateCartItemQuantity);
  


module.exports = router;