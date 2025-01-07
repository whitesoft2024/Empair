// models/Supplier.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    parentGroup: { type: String },
    groupName: { type: String },
    isActive: { type: String },
    isFinalGroup: { type: String },
});

module.exports = mongoose.model('GroupStock', groupSchema);
