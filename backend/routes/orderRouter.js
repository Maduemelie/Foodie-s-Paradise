const express = require("express");
const router = express.Router();
const controller = require('../controllers/orderController')

router.route('/').post(controller.createOrder)
router.route('/').get(controller.userOrderHistory)


module.exports = router