const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');
const {
  getOne,
  getAll,
} = require('./handlerFactory')

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

// @desc Create cash order
// @route POST  /api/v1/orders/cartId
// @access Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // App Setting
  const texPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId); 
  if (!cart)
    throw new NotFoundError(`There is no such cart with id :${req.params.cartId}`)
  
  // 2) Get order price dapend on cart price " check if coupon or not"
  const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + texPrice + shippingPrice;
  // 3) Create order with default paymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress:req.body.shippingAddress,
    totalOrderPrice,
  })
  if (order) {
    // 4) After creating order, decrement product quantity, incerment product sold
    const bulkOpts = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
      }
    }));
    await Product.bulkWrite(bulkOpts, {});
    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res
    .status(StatusCodes.CREATED)
    .json({
      status: 'Success',
      data: order
    });
  
})


exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'user')
    req.filterObject = { user: req.user._id }
  next() ;
});

// @desc Get All Orders
// @route GET  /api/v1/orders
// @access Protected/User-Admin-Manager
exports.getAllOrders = getAll(Order);

// @desc Get  Specific order by id
// @route POST  /api/v1/orders/:id
// @access Protected/User-Admin-Manager
exports.getSpecificOrder = getOne(Order);


// @desc Update  order paid status
// @route PUT  /api/v1/orders/:id/pay
// @access Protected/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    throw new NotFoundError(`There is no such order with id: ${req.params.id}`)
  
  // Updated order to paid
  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();
  res
    .status(StatusCodes.OK)
    .json({
      status: "Success",
      data: updatedOrder
    });
});


// @desc Update  order delivered status
// @route PUT  /api/v1/orders/:id/deliver
// @access Protected/Admin-Manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    throw new NotFoundError(`There is no such order with id: ${req.params.id}`)
  
  // Updated order to delivered
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();
  res
    .status(StatusCodes.OK)
    .json({
      status: "Success",
      data: updatedOrder
    });
});



// @desc Get checkout session from stripe and send it as response
// @route GET  /api/v1/orders/checkout-session/:cartId
// @access Protected/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // App Setting
  const texPrice = 0;
  const shippingPrice = 0
  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart)
    throw new NotFoundError(`There is no such cart with id: ${req.params.cartId}`)
  
  // 2) Get order price depend on cart price "Check if coupon apply or not"
  const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + texPrice + shippingPrice;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        unit_amount: totalOrderPrice * 100,
        currency: 'egp',
        product_data: {
          name: req.user.name,
          description: 'Description Details',
          // images:req.
        }
      },
      quantity:1,
    }],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    client_reference_id: req.params.cartId,
    customer_email: req.user.email,
    metadata:req.body.shippingAddress,
  })

  // 4) send session to response
  res.status(StatusCodes.OK).json({ status: 'success', session });
  
})
