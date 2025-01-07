const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  sl_no: { type: Number },
  customerType: { type: String },
  customerId: { type: String },
  customerName: { type: String },
  date: { type: String },
  guardianName: { type: String },
  relation: { type: String },
  address: { type: String },
  // customerMobile: { type: String },
  customerMobile: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
    match: [/^\d{10}$/, 'Customer mobile number must be exactly 10 digits.'], // Regex for exactly 10 digits
  },
  telephoneNo: { type: String },
  amount: { type: String },
  referenceName: { type: String },
  referenceMobile: { type: String },
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
// Middleware function to add serial number before saving
// CustomerSchema.pre('save', async function(next) {
//   try {
//     if (!this.sl_no) {
//       // Check if serial number already exists
//       const lastMembership = await Membership.findOne({}, {}, { sort: { 'si_no': -1 } });
//       const lastSiNo = lastMembership ? lastMembership.sl_no : 0;
//       this.sl_no = lastSiNo + 1; // Increment serial number
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// Create models from the schemas
const Customer = mongoose.model('CustomerData', CustomerSchema);

module.exports = Customer;