// models/Supplier.js
const mongoose = require('mongoose');

const UOMSchema = new mongoose.Schema({
    UOM: { type: String },
    decimalPlace: { type: String },
    description: { type: String },
    isActive: { type: String },
});

module.exports = mongoose.model('UOMStock', UOMSchema);
