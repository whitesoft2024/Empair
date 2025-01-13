// models/Supplier.js
const mongoose = require('mongoose');

// const groupSchema = new mongoose.Schema({
//     parentGroup: { type: String },
//     groupName: { type: String },
//     isActive: { type: String },
//     isFinalGroup: { type: String },
// });

const groupSchema = new mongoose.Schema({
    parentGroup: { type: String, required: [true, 'Parent group is required.'] },
    groupName: { type: String, required: [true, 'Group name is required.'], unique: true },
    isActive: { type: String, required: [true, 'isActive status is required.'] },
    isFinalGroup: { type: String, required: [true, 'isFinalGroup status is required.'] },
});


module.exports = mongoose.model('GroupStock', groupSchema);
