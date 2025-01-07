const mongoose = require('mongoose');

// Item schema
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

// Transaction schema
const TransactionSchema = new mongoose.Schema({
  Date : {type : Date , required:true},
  BillNo: { type: String, required: true },
  TransactionType: { type: String, required: true },
  TransactionId: { type: String, required: true },
  items: [ItemSchema] // Nested array of items
});

// Main customer schema
const CustomerSchema = new mongoose.Schema({
  CustomerName: { type: String, required: true },
  CustomerMobile: { type: String, required: true },
  transactions: [TransactionSchema] // Nested array of transactions
});

// Creating the model
const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
