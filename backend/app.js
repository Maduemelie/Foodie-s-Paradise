const express = require("express");
const connectToDb = require("./config/mongoDb");
const mealRouter = require("./routes/mealPlanRoutes");
const foodRouter = require("./routes/foodRoutes");
const orderRouter = require('./routes/orderRouter')
const cors = require('cors')

require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 4000;


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/api/v1/mealplan", mealRouter);
app.use("/api/v1/food", foodRouter);
app.use("/api/v1/order", orderRouter);


app.get("/", (req, res) => {
  res.json({ message: " Welcome to Foodies Paradise" });
});

connectToDb();

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
