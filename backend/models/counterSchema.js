const mongoose = require('mongoose');


const CounterSchema = new mongoose.Schema({
    field: { type: String, required: true, unique: true }, // e.g., 'BillNo' or 'TransactionId'
    prefix: { type: String, default: '' }, // Optional prefix, e.g., 'SAL' for sales transactions
    counter: { type: Number, required: true, default: 0 } // The current value of the counter
  });
  
  const Counter = mongoose.model('Counter', CounterSchema);
  
  module.exports = Counter;
  