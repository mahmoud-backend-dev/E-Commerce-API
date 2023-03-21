const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequest } = require('../errors');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const calcTolalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
}

// @desc Create Cart
// @route POST  /api/v1/cart
// @access Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId)

  // 1) Get Cart for logged user
  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart) {
    // Create cart for logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }]
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      item => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      // product exist in cart, PUT product
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart, push product to cartItems arrays
      cart.cartItems.push({ product: productId, color, price: product.price })
    }
  }
  // Calculate total cart price
  calcTolalCartPrice(cart);
  await cart.save()

  res
    .status(StatusCodes.OK)
    .json({
      status: "Success",
      numOfCartItems: cart.cartItems.length,
      message: "Product added to cart successuflly.",
      data: cart
    });
})


// @desc Get logged user cart
// @route GET  /api/v1/cart
// @access Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart)
    throw new NotFoundError(`There is no cart for this user id: ${req.user._id}`)
  
  res
    .status(StatusCodes.OK)
    .json({
      status: "Success",
      numOfCartItems: cart.cartItems.length,
      data: cart
    })
});


// @desc Remove Specific cart item
// @route DELETE  /api/v1/cart/:itemId
// @access Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    {
      user: req.user._id 
    },
    {
      $pull: { cartItems: { _id: req.params.itemId } }
    },
    {
      new: true
    }
  );

  if (!cart)
    throw new NotFoundError(`There is no cart item for this user id: ${req.params.itemId}`)
  calcTolalCartPrice(cart);

  res
    .status(StatusCodes.OK)
    .json({
      status: "Success",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    })
});


// @desc Cleat All Cart Items
// @route DELETE  /api/v1/cart
// @access Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(StatusCodes.NO_CONTENT).send();
});

// @desc Update Specific Cart Item Quantity
// @route UPDATE  /api/v1/cart/:itemId
// @access Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const {    } = req.body;
  const { itemId } = req.params;
  const cart = await Cart.findOne({ user: _id })
  if (!cart)
    throw new NotFoundError(`There is no cart for this user id: ${req.user._id}`)
  const itemIndex = cart.cartItems.findIndex(item => item._id.toString() === itemId)
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex]
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    throw new NotFoundError(`There is no item for this user id: ${req.user._id}`)
  }
  calcTolalCartPrice(cart);
  await cart.save()
  res
    .status(StatusCodes.OK)
    .json({
      status: "Success",
      numOfCartItems: cart.cartItems.length,
      message: "Update Quantity Successuflly.",
      data: cart
    })
});


// @desc Apply coupon on logged user cart
// @route PUT  /api/v1/cart/applyCoupon
// @access Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name and expire time
  console.log("test");
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon)
    throw new BadRequest("Coupon is invalid or  expired")
  
  // 2) Get looged user cart item to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart)
    throw new NotFoundError(`There is no cart for this user id: ${req.user._id}`)
  const totalPrice = cart.totalCartPrice;
  // 3) Calculate price after priceAfterDiscount
  const priceAfterDiscount = (
    totalPrice - (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23
  cart.totalPriceAfterDiscount = priceAfterDiscount;
  await cart.save();
  res
    .status(StatusCodes.OK)
    .json({
      status: "Success",
      numOfCartItems: cart.cartItems.length,
      message: "Apply  Coupon Successuflly.",
      data: cart
    })
});

