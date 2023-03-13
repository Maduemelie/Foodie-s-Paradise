const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;