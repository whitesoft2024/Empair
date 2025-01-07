const mongoose = require('mongoose');

// Define a sub-schema for the individual items
const ItemSchema = new mongoose.Schema({
    itemCode: { type: String },
    barCode: { type: String },
    itemName: { type: String },
    itemNameml: { type: String },
    groupName: { type: String },
    purchaseRate: { type: String },
    salesRate: { type: String },
    mrp: { type: String },
    minRate: { type: String },
    cgst: { type: String },
    sgst: { type: String },
    opStock: { type: String },
    baseUom: { type: String },
    brand: { type: String },
    qty: { type: String },
    location: { type: String },
    expiryDays: { type: String },
    isService: { type: String },
    hasBatch: { type: String },
    hasSerialNo: { type: String },
    hasWarranty: { type: String },
    rawMaterials: { type: String },
    salesItem: { type: String },
    stockTracking: { type: String },
    expiredItem: { type: String },
    FMP: { type: String }
});

// Main ProductsData Schema
const ProductsDataSchema = new mongoose.Schema({
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchemeCreate', required: true },
    invoiceNumber: { type: String },
    schemeBarCode: { type: String },
    invoiceDate: { type: Date },
    itemDescription: { type: String },
    // Array of items using the ItemSchema
    items: [ItemSchema]  // This is the array where detailed item data will go
});

module.exports = mongoose.model('ProductsDetails', ProductsDataSchema);