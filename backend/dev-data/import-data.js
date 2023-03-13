const mongoose = require("mongoose");
const Food = require("../models/foodModel");
const fs = require("fs");
require("dotenv").config();
const mealplan = require("../models/mealPlanModel");
const controller = require("../controllers/mealPlanController");

const MONGOOSE_URL = process.env.MONGOOSE_URL;
// console.log(MONGOOSE_URL)
const connectToDb = () => {
  mongoose.connect(MONGOOSE_URL);

  mongoose.connection.on("connected", () => {
    console.log("connected to MongoDb successfully");
  });

  mongoose.connection.on("error", (error) => {
    console.log("An error occurred", error);
  });
};
module.exports = connectToDb;
connectToDb();
const foods = JSON.parse(fs.readFileSync(`${__dirname}/food.json`));
// console.log(tours);

// Group the foods by category
const categories = {};
foods.forEach((food) => {
  if (!categories[food.category]) {
    categories[food.category] = [];
  }
  categories[food.category].push(food.name);
});

// Create arrays of 4 for each category
const meals = [];
for (const category in categories) {
  const categoryFoods = categories[category];
  let i = 0;
  while (i < categoryFoods.length) {
    const meal = [];
    for (let j = 0; j < 4 && i < categoryFoods.length; j++) {
      meal.push(categoryFoods[i]);
      i++;
    }
    meals.push(meal);
  }
}

// Create the resulting object and write to a new file
const result = { meals };
fs.writeFileSync(`${__dirname}/meals.json`, JSON.stringify(result, null, 2));

console.log('Foods sorted into arrays of 4 by category!');
const deleteData = async () => {
  try {
    await Food.deleteMany();
    console.log("files deleted");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const importData = async () => {
  try {
    await Food.create(foods);
    console.log("file created successfully");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
//the process
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

// controller.createMealPlan(
//   "Monday",

//   [
//     "Boiled Plantain and Egg Sauce",
//     "Akara and Pap",
//     "Oatmeal",
//     "Plantain Pancakes",
//   ],
//   [
//     "Fried Rice and Chicken",
//     "Jollof Spaghetti with Fried Fish",
//     "Ofada Rice with Fried Chicken",
//     "Grilled Turkey and Coleslaw",
//   ],
//   [
//     "Efo Riro and Eba",
//     "Egusi Soup and Semovita",
//     "Banga Soup and Pounded Yam",
//     "Okra Soup with Fufu",
//   ]
// );
// controller.getmealplan("Monday");
