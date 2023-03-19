const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('express-async-handler');


// @desc add Address to User Addresses
// @route POST  /api/v1/addresses
// @access Protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // Adds elements to an array only if they do not already exist in the set
      $addToSet: { addresses: req.body },
    },
    {
      new: true,
    }
  );
  res
    .status(StatusCodes.OK)
    .json({
      status: "Success",
      message: "Address added successfully to your user addresses. ",
      data: user.addresses,
    });
});

// @desc Remove Address From User Addresses
// @route DELETE  /api/v1/addresses/:addressId
// @access Protected/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } }
    },
    {
      new: true,
    }
  );

  res
    .status(StatusCodes.OK)
    .json({
      status: "Success",
      message: "Address removed successfully from your user addresses. ",
      data: user.addresses,
    });
})


// @desc Get Logged User Addresses
// @route GET  /api/v1/addresses
// @access Protected/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(
    req.user._id,
  ).populate('addresses');

  res
    .status(StatusCodes.OK)
    .json({
      status: "Success",
      result: user.addresses.length,
      data: user.addresses,
    });
});
