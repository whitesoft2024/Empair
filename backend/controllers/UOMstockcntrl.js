const UOMstock = require('../models/UOMstockModel');

exports.addUOM = async (req, res) => {
    const UOMData = req.body;

    const newUOM = new UOMstock({
        UOM: UOMData.UOM,
        decimalPlace: UOMData.decimalPlace,
        description: UOMData.description,
        isActive: UOMData.isActive,
    });

    try {
        const savedUOM = await newUOM.save();
        res.status(201).json(savedUOM);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add UOM' });
    }
};

exports.getAllUOM = async (req, res) => {
    try {
        const uomStock = await UOMstock.find();
        res.status(200).json(uomStock);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get uom' });
    }
};