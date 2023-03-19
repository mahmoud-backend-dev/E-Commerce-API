
const {
  createOne,
  getOne,
  getAll,
  updateOne,
  deleteOne,
} = require('./handlerFactory')

const Coupon = require('../models/Coupon');

// @desc Create Coupon
// @route POST  /api/v1/coupons
// @access Private/Admin-Manager
exports.createCoupon = createOne(Coupon);

// @desc Get List Of Coupon
// @route GET   /api/v1/coupons
// @access Private/Admin-Manager 
exports.getAllCoupons = getAll(Coupon);

// @desc  Get Specific Coupon by id
// @route GET   /api/v1/coupons/:id
// @access Private/Admin-Manager
exports.getCoupon = getOne(Coupon);


// @desc  Get Specific Coupon by id
// @route GET   /api/v1/coupons/:id
// @access Private/Admin-Manager
exports.updateCoupon = updateOne(Coupon);

// @desc  Delete Specific Coupon by id
// @route DELETE   /api/v1/coupons/:id
// @access Private/Admin-Manager
exports.deleteCoupon = deleteOne(Coupon);