const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const RegSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{10}$/, 
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
});

RegSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('REGISTER', RegSchema);