const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: String,
  mobileNo: String,
  username: String,
  email: String,
  password: String,
  otp: String,
  otpExpires: { type: Date, index: { expires: '1m' } } // TTL set to 1 minute
});

const userregister = mongoose.model('user', UserSchema);

module.exports = userregister;
