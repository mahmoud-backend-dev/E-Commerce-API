const mongoose = require('mongoose');

const cartSchame = new mongoose.Schema(
  {
    cartItems: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product required"]
      },
      quantity: {
        type: Number,
        default: 1
      },
      color: String,
      price: Number,
    }
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User required"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchame);