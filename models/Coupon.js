const mongoose = require('mongoose');

const couponSchame = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Coupon name requied'],
    unique: true,
  },
  expire: {
    type: Date,
    required: [true, "Coupon expire time requied"],
  },
  discount: {
    type: Number,
    required: [true, "Coupon discount value requied"]
  }
},
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchame);