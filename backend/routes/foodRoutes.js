const express = require("express");
const router = express.Router();
const controller = require("../controllers/foodController");

router.route('/').post(controller.createFood)
router.route('/').get(controller.getFood)


module.exports = router