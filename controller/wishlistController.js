const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('express-async-handler');


// @desc add Product to wishlist
// @route POST  /api/v1/wishlist
// @access Protected/User
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // Adds elements to an array only if they do not already exist in the set
      $addToSet: { wishlist: req.body.productId },
    },
    {
      new: true,
    }
  );
  res
    .status(StatusCodes.OK)
    .json({
      status: "Success",
      message: "Product added successfully to your wishlist. ",
      data: user.wishlist,
    });
});

// @desc Remove Product From wishlist
// @route DELETE  /api/v1/wishlist/:productId
// @access Protected/User
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId }
    },
    {
      new: true,
    }
  );

  res
    .status(StatusCodes.OK)
    .json({
      status: "Success",
      message: "Product removed successfully from your wishlist. ",
      data: user.wishlist,
    });
})


// @desc Get Logged User Wishlist
// @route GET  /api/v1/wishlist
// @access Protected/User
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(
    req.user._id,
  ).populate('wishlist');

  res
    .status(StatusCodes.OK)
    .json({
      status: "Success",
      result: user.wishlist.length,
      data: user.wishlist,
    });
});
