const express = require("express");
const router = express.Router();
const controller = require("../controllers/mealPlanController");

router.route("/").post(controller.createMealPlan);
router.route("/:day").get(controller.getmealplan);

module.exports = router;
