const Brandstock = require('../models/brandstockModel');

exports.addbrand = async (req, res) => {
    const brandData = req.body;

    const newBrand = new Brandstock({
        brandName: brandData.brandName,
        isActive: brandData.isActive,
    });

    try {
        const savedBrand = await newBrand.save();
        res.status(201).json(savedBrand);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add BrandName' });
    }
};

exports.getAllbrand = async (req, res) => {
    try {
        const brandStock = await Brandstock.find();
        res.status(200).json(brandStock);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get brandName' });
    }
};