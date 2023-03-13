const Customer = require('../models/customerModel')

exports.createCustomer = async() => {
    try {
        const newCustomer = await Customer.create(req.body)
        res.status(200).json({
            status: 'Success',
            data: newCustomer
        })
    } catch (error) {
        res.status(500).json({
            status: "Fail",
            data: null
        
        })
        console.log(error.message)
        
    }
}