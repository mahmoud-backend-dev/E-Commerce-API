const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require('../controller/wishlistController');

const {
  protect,
  allowedTo,
} = require('../controller/authController');

const express = require('express');
const router = express.Router();

router.use(protect, allowedTo('user'));

router.route('/').post(addProductToWishlist).get(getLoggedUserWishlist);
router.delete('/:productId', removeProductFromWishlist);

module.exports = router;