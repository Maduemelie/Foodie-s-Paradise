const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Completed", "Cancelled"],
      default: "Completed",
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
