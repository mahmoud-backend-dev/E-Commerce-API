const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require('../controller/addressController');

const {
  protect,
  allowedTo,
} = require('../controller/authController');

const express = require('express');
const router = express.Router();

router.use(protect, allowedTo('user'));

router.route('/').post(addAddress).get(getLoggedUserAddresses);
router.delete('/:addressId', removeAddress);

module.exports = router;