const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;