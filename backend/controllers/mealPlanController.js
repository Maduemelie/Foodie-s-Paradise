const MealPlan = require("../models/mealPlanModel");
const Food = require("../models/foodModel");

exports.createMealPlan = async (req, res) => {
  try {
    let {
      day,
      meals: { morning, afternoon, evening },
    } = req.body;
    // console.log(morning, "morning")
    morning = await Promise.all(
      morning.map(async (foodName) => {
        const food = await Food.findOne({ name: foodName });
        console.log(food.name);

        return food._id;
      })
    );
    afternoon = await Promise.all(
      afternoon.map(async (foodName) => {
        const food = await Food.findOne({ name: foodName });
        return food._id;
      })
    );
    evening = await Promise.all(
      evening.map(async (foodName) => {
        const food = await Food.findOne({ name: foodName });
        return food._id;
      })
    );
    const newMealPlan = await MealPlan.create({
      day: day,
      meals: {
        morning: morning,
        afternoon: afternoon,
        evening: evening,
      },
    });
    res.status(200).json({
      message: "File created",
      data: newMealPlan,
    });
    console.log(`Created meal plan for ${day}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Fail",
      error: error.message,
    });
  }
};

exports.getmealplan = async (req, res) => {
  try {
    const userId = req.header('X-User-Id');
    // console.log(userId)
    if (!userId) {
      res.status(401).send('Unauthorized');
      return;
    }
    const { day } = req.params;
    // Find the MealPlan document by day
    const mealPlan = await MealPlan.findOne({ day }).populate(
      "meals.morning meals.afternoon meals.evening"
    );

    const morningFoods = mealPlan.meals.morning.map(
      (food) => `${food.name} - $${food.price}`
    );
    const afternoonFoods = mealPlan.meals.afternoon.map(
      (food) => `${food.name} - $${food.price}`
    );
    const eveningFoods = mealPlan.meals.evening.map(
      (food) => `${food.name} - $${food.price}`
    );

    // console.log(morningMeal, afternoonMeal, eveninggMeal)
    res.status(200).json({
      status: "success",
      meals: {
        morning: morningFoods,
        afternoon: afternoonFoods,
        evening: eveningFoods,
      },
    });
    // Return the MealPlan document
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Fail",
      error,
    });
  }
};
