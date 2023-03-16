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
        console.log(food);
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

exports.userOrderHistory = async (req, res) => {
  try {
    const userId = "lfamyrt4phx84ucat7";
    const customerName = userId;
    // Get the user ID from the request headers
    // const userId = req.header("X-User-Id");
    // if (!userId) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    // Find all orders for the current user
    const orders = await Order.find({ customerName }).populate("orderItems");

    // Map the orders to a more readable format
    // Map the orders to a more readable format
    const formattedOrders = orders.map(order => ({
      id: order._id,
      items: order.orderItems.map(item => ({
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
