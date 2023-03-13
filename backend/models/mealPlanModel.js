const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    unique: true,
  },
  meals: {
    morning: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
      },
    ],
    afternoon: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
      },
    ],
    evening: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
      },
    ],
    // required: true,
  },
});

// Create a model for the meal plan data using the schema
const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

module.exports = MealPlan;
