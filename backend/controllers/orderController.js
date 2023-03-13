const Order = require("../models/orderModel");
const Food = require("../models/foodModel");

exports.createOrder = async (req, res) => {
  try {
      let { customerName, orderItems } = req.body;
      if(orderItems.length === 0) return
    orderItems = await Promise.all(
        orderItems.map(async (foodName) => {
          console.log(foodName)
            let food = await Food.findOne( {name: foodName} );
            console.log(food)
            return food._id
        }
         )
      
    );

    
     
    
    
    const order = await Order.create({
      customerName,
      orderItems
    });
    res.status(200).json({
      status: "Success",
      data: order,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
