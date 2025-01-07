// controllers/supplierController.js
const addItem = require('../models/addItemModel');



const generateRandomBarcode = async () => {
    let isUnique = false;
    let newBarcode;

    // Ensure barcode is unique
    while (!isUnique) {
        newBarcode = Math.floor(10000000000 + Math.random() * 90000000000); // Generate 11-digit number
        const existingItem = await addItem.findOne({ barCode: newBarcode });
        if (!existingItem) {
            isUnique = true;
        }
    }

    return newBarcode.toString(); // Convert to string if needed
};

exports.addItem = async (req, res) => {
    const itemData = req.body;

    try {
        // Check if barcode is empty, generate a new one if necessary
        if (!itemData.barCode || itemData.barCode.trim() === "") {
            itemData.barCode = await generateRandomBarcode();
        }

        console.log('Item Data:', itemData);

        const newAddItem = new addItem({
            itemCode: itemData.itemCode,
            barCode: itemData.barCode,
            itemName: itemData.itemName,
            itemNameml: itemData.itemNameml,
            groupName: itemData.groupName,
            purchaseRate: itemData.purchaseRate,
            salesRate: itemData.salesRate,
            mrp: itemData.mrp,
            minRate: itemData.minRate,
            cgst: itemData.cgst,
            sgst: itemData.sgst,
            opStock: itemData.opStock,
            hsnNumber: itemData.hsnNumber,
            baseUom: itemData.baseUom,
            brand: itemData.brand,
            location: itemData.location,
            expiryDays: itemData.expiryDays,
            isService: itemData.isService,
            hasBatch: itemData.hasBatch,
            hasSerialNo: itemData.HasSerialNo,
            hasWarranty: itemData.hasWarranty,
            rawMaterials: itemData.rawMaterials,
            salesItem: itemData.salesItem,
            stockTracking: itemData.stockTracking,
            expiredItem: itemData.expiredItem,
            FMP: itemData.FMP,
        });

        const savedItem = await newAddItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Failed to add item' });
    }
};

exports.getAllItem = async (req, res) => {
    try {
        // Parse and validate query parameters
        const page = Math.max(parseInt(req.query.page) || 1, 1); // Default to page 1, minimum value 1
        const MAX_LIMIT = 100; // Maximum limit to prevent excessive data fetching
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), MAX_LIMIT); // Default to 10, enforce max limit
        const search = req.query.search || ""; // Get search query, default to empty

        // Build query for searching by itemName or barCode
        const query = search
            ? {
                $or: [
                    { itemName: { $regex: search, $options: "i" } }, // Case-insensitive search
                    { barCode: { $regex: search, $options: "i" } }, // Case-insensitive search
                ],
            }
            : {};

        // Get the total count of documents matching the query
        const total = await addItem.countDocuments(query);

        // Calculate total pages and current page
        const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
        const currentPage = total > 0 ? Math.min(page, totalPages) : 1;

        // Fetch paginated data matching the query with projection for optimization
        const data = await addItem.find(query)
            .skip((currentPage - 1) * limit)
            .limit(limit)
            .exec();

        // Calculate nextPage
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;

        // Construct and send response
        res.status(200).json({
            data,
            currentPage,
            nextPage,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
        });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({
            error: "Failed to get items",
            details: error.message || "Unknown error occurred",
        });
    }
};

exports.getItem = async (req, res) => {
    try {
        const items = await addItem.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get items' });
    }
};