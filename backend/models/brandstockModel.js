const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brandName: { type: String },
    isActive: { type: String },
});

module.exports = mongoose.model('BrandStock', brandSchema);
