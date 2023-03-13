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