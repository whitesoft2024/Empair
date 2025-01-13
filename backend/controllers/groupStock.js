const GRPstock = require('../models/addGroupStock');

// exports.addGrp = async (req, res) => {
//     const groupstockData = req.body;

//     const newGroup = new GRPstock({
//         parentGroup: groupstockData.parentGroup,
//         groupName: groupstockData.groupName,
//         isActive: groupstockData.isActive,
//         isFinalGroup: groupstockData.isFinalGroup,
//     });

//     try {
//         const savedGroup = await newGroup.save();
//         res.status(201).json(savedGroup);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to add Group' });
//     }
// };


exports.addGrp = async (req, res) => {
    const groupstockData = req.body;

    try {
        // Check if a group with the same groupName already exists
        const existingGroup = await GRPstock.findOne({ groupName: groupstockData.groupName });
        if (existingGroup) {
            return res.status(400).json({ message: 'Group with this name already exists' });
        }

        // Create a new group
        const newGroup = new GRPstock({
            parentGroup: groupstockData.parentGroup,
            groupName: groupstockData.groupName,
            isActive: groupstockData.isActive,
            isFinalGroup: groupstockData.isFinalGroup,
        });

        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (error) {
        // console.error('Error adding group:', error);
        // res.status(500).json({ error: 'Failed to add group' });


        if (error.name === 'ValidationError') {
            // Extract error messages from the schema validation errors
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: 'Validation failed.', errors: messages });
        }
        res.status(500).json({ message: 'Failed to add group.', error: error.message });
    
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