const Food = require('../models/foodModel')

exports.createFood = async (req, res) => {
    try {
        const newFood = await Food.create(req.body)
        res.status(200).json({
            status: "Success",
            data: newFood
        })
    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        })
        
    }
}
exports.getFood = async(req, res) =>{
    try {
        const foodId = req.params.foodId
      const foodItem = await Food.findById(foodId);
      if (!foodItem) {
        throw new Error("Food item not found.");
      }
      return foodItem;
    } catch (error) {
      console.error(error.message);
    }
  }
