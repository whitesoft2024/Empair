const mongoose = require('mongoose');

// Reference Details Schema (nested inside ReferenceSchema)
const ReferenceDetailsSchema = new mongoose.Schema({
    referenceId: { type: String, required: true },
    referenceMobile: { type: String, required: true },
    referenceName: { type: String, required: true },
    referenceAmount: { type: String},
    schemePurchaseId: { type: String}
});

// Reference Schema in its own collection
const ReferenceSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'SchemeCreate', required: true },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerMobile: { type: String },
    referenceId: { type: String },
    request: { type: String },
    referenceDetails: [ReferenceDetailsSchema] // Array of references
});

// CustomerData Schema
const CustomerDataSchema = new mongoose.Schema({
    sl_no: { type: Number },
    invoiceNumber: { type: String },
    schemePurchaseId: { type: String },
    customerType: { type: String },
    customerId: { type: String },
    customerName: { type: String },
    referenceName: { type: String, required: true },
    referenceId: { type: String, required: true },
    referenceMobile: { type: String },
    date: { type: String },
    guardianName: { type: String },
    relation: { type: String },
    address: { type: String },
    customerMobile: { type: String },
    telephoneNo: { type: String },
    amount: { type: String },
    dateOfBirth: { type: Date },
    age: { type: Number },
    bloodGroup: { type: String },
    profession: { type: String },
    district: { type: String },
    taluk: { type: String },
    cityVillageName: { type: String },
    panchayathName: { type: String },
    postalCityName: { type: String },
    pinCode: { type: String },
    email: { type: String },
    annualIncome: { type: String },
    caste: { type: String },
    subCaste: { type: String },
    gender: { type: String },
    maritalStatus: { type: String },
    nomineeName: { type: String },
    nomineeMobile: { type: String },
    nomineeRelation: { type: String },
    userName: { type: String },
    userTime: { type: String },
    aadharNumber: { type: String },
    aadharFrontImage: { type: String },
    aadharBackImage: { type: String },
    panNumber: { type: String },
    panImage: { type: String },
    selectedPaymentMethod: { type: String },
    transactionId: { type: String },
    cashTransactionId: { type: String },
    transactionTime: { type: String },
    signatureImage: { type: String },
    receiptNumber: { type: String },
    BankName: { type: String },
    AccountNo: { type: String },
    BranchName: { type: String },
    ifsc: { type: String }
});

// Scheme Schema
const SchemeSchema = new mongoose.Schema({
    SchemeName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    customerData: [CustomerDataSchema]
});

// Export the models
module.exports = {
    Scheme: mongoose.model('SchemeCreate', SchemeSchema),
    Reference: mongoose.model('Reference', ReferenceSchema) // Ensure the Reference is correctly defined and exported here
};

