const express = require("express");
const connectToDb = require("./config/mongoDb");
const cookieParser = require('cookie-parser');
const mealRouter = require("./routes/mealPlanRoutes");
const foodRouter = require("./routes/foodRoutes");
const orderRouter = require('./routes/orderRouter')
const cors = require('cors')
const {generateUserId} = require('./utils/userId')


require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 4000;


app.use(cors())
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/api/v1/mealplan", mealRouter);
app.use("/api/v1/food", foodRouter);
app.use("/api/v1/order", orderRouter);


app.get("/Foodie's_Paradise", (req, res) => {
  const userId = generateUserId()// function to generate a unique user ID
  console.log(userId)
  res.cookie('userId', userId, { maxAge: 86400000});
  res.sendFile(__dirname + "/public/index.html")

});

connectToDb();

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
