const mongoose = require('mongoose');

const orderSchame = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order must be belong to user"]
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product required"]
        },
        quantity: Number,
        color: String,
        price: Number,
      }
    ],
    texPrice: {
      type: Number,
      default: 0
    },
    shippingPrice: {
      type: Number,
      default: 0
    },
    shippingAddress:{
      details: String,
      phone: String,
      city: String,
      postalCode: String
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethodType: {
      type: String,
      enum: ['card', 'cash'],
      default: 'cash',
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: Date,
  },
  {
    timestamps: true,
  }
);

orderSchame.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name profileImg email phone',
  }).populate({
    path: 'cartItems.product',
    select: 'title imageCover',
  })
  next();
})

module.exports = mongoose.model('Order', orderSchame);