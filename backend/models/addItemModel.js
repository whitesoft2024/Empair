// models/Supplier.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    itemCode: { type: String },
    barCode: { type: String },
    itemName: { type: String },
    itemNameml:{ type: String },
    groupName:{ type: String },
    purchaseRate: { type: String },
    salesRate:{ type: String },
    mrp: { type: String },
    minRate: { type: String },
    cgst: { type: String },
    sgst:{ type: String },
    opStock: { type: String },
    hsnNumber: { type: String },
    baseUom: { type: String },
    brand: { type: String },
    location:{ type: String },
    expiryDays: { type: String },
    isService: { type: String },
    hasBatch: { type: String },
    hasSerialNo: { type: String },
    hasWarranty: { type: String },
    rawMaterials: { type: String },
    salesItem: { type: String },
    stockTracking: { type: String },
    expiredItem: { type: String },
    FMP: { type: String },
});

module.exports = mongoose.model('Items', ItemSchema);
