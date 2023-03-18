const Order = require("../models/orderModel");
const Food = require("../models/foodModel");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.header("X-User-Id");
    // console.log(userId)
    if (!userId) {
      res.status(401).send("Unauthorized");
      return;
    }
    let { customerName, orderItems, totalPrice } = req.body;
    if (orderItems.length === 0) return;
    orderItems = await Promise.all(
      orderItems.map(async (foodName) => {
        // console.log(foodName)
        let food = await Food.findOne({ name: foodName });
        console.log(food.name);
        return food._id;
      })
    );
    const order = await Order.create({
      customerName,
      orderItems,
      totalPrice,
    });
    res.status(200).json({
      status: "Success",
      data: order,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// get the order history of a user
exports.userOrderHistory = async (req, res) => {
  try {
    let { customerName } = req.body;
    // Get the user ID from the request headers
    const userId = req.header("X-User-Id");
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    customerName = userId;
    // Find all orders for the current user
    const orders = await Order.find({ customerName }).populate("orderItems");
console.log(orders)
    // Map the orders to a more readable format
    const formattedOrders = orders.map((order) => ({
      id: order._id,
      items: order.orderItems.map((item) => ({
        name: item.name,
        price: item.price,
      })),
      total: order.totalPrice,
      status: order.status,
      timestamp: order.createdAt,
    }));
    // Send the formatted orders as a JSON response
    res.status(200).json(formattedOrders);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getCurrentOrder = async (req, res) => {
  try {
    // Get the user ID from the request headers
    let customerName = req.params.id;
    const userId = req.header("X-User-Id");
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the most recent order for the current user
    const order = await Order.findOne({ customerName })
      .sort({ createdAt: -1 })
      .populate("orderItems");

    if (!order) {
      // If there is no order, send a message to the user
      res.json({ message: "No order found" });
      return;
    }

    // Format the order items as an array of objects with name, price
    const formattedItems = order.orderItems.map((item) => ({
      name: item.name,
      price: item.price,
    }));

    // Send the most recent order to the user as a JSON response
    res.json({
      id: order._id,
      items: formattedItems,
      total: order.totalPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {

    let customerName = req.params.id
    // Get the user ID from the request headers
    const userId = req.header("X-User-Id");
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the most recent order for the current user
    const order = await Order.findOne({ customerName }).sort({ createdAt: -1 });

    if (!order) {
      // If there is no current order, send a message to the user
      res.json({ message: "No current order to cancel" });
      return;
    }

    // Update the order status to "canceled" and save the changes to the database
    order.status = "Cancelled";
    await order.save();

    // Send a confirmation message to the user
    res.json({ message: "Order canceled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
