
const {
  createCoupon,
  getCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require('../controller/couponController');

const {
  protect,
  allowedTo,
} = require('../controller/authController');

const express = require('express');
const router = express.Router();

router.use(protect, allowedTo('admin', 'manager'));

router.route('/')
  .get(getAllCoupons)
  .post(createCoupon);
router.route('/:id')
  .get(getCoupon)
  .put(updateCoupon)
  .delete(deleteCoupon);


module.exports = router;