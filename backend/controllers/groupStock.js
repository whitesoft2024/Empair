const GRPstock = require('../models/addGroupStock');

exports.addGrp = async (req, res) => {
    const groupstockData = req.body;

    const newGroup = new GRPstock({
        parentGroup: groupstockData.parentGroup,
        groupName: groupstockData.groupName,
        isActive: groupstockData.isActive,
        isFinalGroup: groupstockData.isFinalGroup,
    });

    try {
        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add Group' });
    }
};

exports.getAllGroup = async (req, res) => {
    try {
        const GroupStock = await GRPstock.find();
        res.status(200).json(GroupStock);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get GroupName' });
    }
};