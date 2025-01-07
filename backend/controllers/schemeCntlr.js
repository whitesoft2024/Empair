const { Scheme, Reference } = require('../models/Scheme/schemeModel');
const SchemeProStock = require('../models/Scheme/schemeProduct');
const mongoose = require('mongoose');

exports.addScheme = async (req, res) => {
    const schemeData = req.body;
    console.log(req.body.SchemeName);
    console.log(req.body.isActive);

    const newScheme = new Scheme({
        SchemeName: schemeData.SchemeName,
        isActive: schemeData.isActive,
    });

    try {
        const savedScheme = await newScheme.save();
        res.status(201).json(savedScheme);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add SchemeName' });
    }
};

exports.getAllScheme = async (req, res) => {
    try {
        // Fetch all schemes
        const schemes = await Scheme.find().lean();

        // Fetch the corresponding products for each scheme
        const schemeWithProducts = await Promise.all(schemes.map(async (scheme) => {
            const products = await SchemeProStock.find({ schemeId: scheme._id }).lean();
            return {
                ...scheme,
                products
            };
        }));

        res.status(200).json(schemeWithProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get schemes and products' });
    }
};


exports.getAllCustomersted = async (req, res) => {
    try {
        // Extract pagination parameters from the request, with defaults if not provided
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;


        // Total document count
        // const totalDocuments = await Scheme.countDocuments();

        const totalDocuments = await Scheme.aggregate([
            { $unwind: "$customerData" },
            { $count: "total" }
        ]);

        const schemes = await Scheme.aggregate([
            { $unwind: "$customerData" },
            {
                $lookup: {
                    from: "references",
                    let: { customerName: "$customerData.customerName", referenceId: "$customerData.referenceId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$customerName", "$$customerName"] },
                                        { $eq: ["$referenceId", "$$referenceId"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                request: 1,
                                _id: 0
                            }
                        }
                    ],
                    as: "referenceData"
                }
            },
            { $project: { SchemeName: 1, isActive: 1, customerData: 1, referenceData: 1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        // Transform data into the second format type with indexing
        const formattedSchemes = schemes.reduce((acc, scheme, index) => {
            acc[index] = scheme;
            return acc;
        }, {});

        // Get the count from the aggregation result
        const totalDocs = totalDocuments.length > 0 ? totalDocuments[0].total : 0;
        const totalPages = Math.ceil(totalDocs);

        // // Calculate total pages based on limit
        // const totalPages = Math.ceil(totalDocuments / limit);

        // Send the response with pagination details
        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            totalDocuments: totalDocuments,
            schemes: formattedSchemes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalDocuments = await Scheme.aggregate([
            { $unwind: "$customerData" },
            { $count: "total" }
        ]);

        const schemes = await Scheme.aggregate([
            { $unwind: "$customerData" },
            {
                $lookup: {
                    from: "references",
                    let: { customerName: "$customerData.customerName", referenceId: "$customerData.referenceId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$customerName", "$$customerName"] },
                                        { $eq: ["$referenceId", "$$referenceId"] }
                                    ]
                                }
                            }
                        },
                        { $project: { request: 1, _id: 0 } }
                    ],
                    as: "referenceData"
                }
            },
            { $project: { SchemeName: 1, isActive: 1, customerData: 1, referenceData: 1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        const totalDocs = totalDocuments.length > 0 ? totalDocuments[0].total : 0;
        const totalPages = Math.ceil(totalDocs / limit);

        const formattedSchemes = schemes.reduce((acc, scheme, index) => {
            acc[index] = scheme;
            return acc;
        }, {});

        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            totalDocuments: totalDocs,
            schemes: formattedSchemes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.addProducts = async (req, res) => {
    const schemeData = req.body;
    const schemeId = req.body.id; // Ensure 'id' is being sent in the request body
    const productsDataArray = req.body.items;

    try {
        // Verify that the scheme exists
        const scheme = await Scheme.findById(schemeId);
        if (!scheme) {
            return res.status(404).json({ error: 'Scheme not found' });
        }

        // Create a new ProductsDetails document
        const productsDetails = new SchemeProStock({
            schemeId,
            invoiceNumber: schemeData.invoiceNumber,
            schemeBarCode: schemeData.schemeBarCode,
            invoiceDate: schemeData.invoiceDate,
            itemDescription: schemeData.itemDescription,
            items: productsDataArray
        });

        const savedProducts = await productsDetails.save();

        res.status(201).json(savedProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add Products' });
    }
};

exports.getReference = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchTerm = req.query.searchTerm;

        let query = {};

        if (searchTerm) {
            query.customerData = {
                $elemMatch: {
                    customerName: { $regex: searchTerm, $options: 'i' }
                }
            };
        }

        const total = await Scheme.countDocuments(query);
        const data = await Scheme.find(query)
            .select('customerData')
            .sort({ _id: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        let nextPage = null;
        if (total > page * limit) {
            nextPage = page + 1;
        }

        // Map the data to only include the customerData details
        const filteredData = data.map(doc => ({
            customerData: doc.customerData
        }));

        res.json({ data: filteredData, nextPage, total });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get SchemeName' });
    }
};

const generateReferenceId = async (referenceId) => {
    // Helper function to increment a sequence of letters (e.g., A -> B, Z -> AA, AZ -> BA, ZZ -> AAA)
    function incrementSequence(sequence) {
        let result = '';
        let carry = true; // Initialize carry to increment the sequence
        for (let i = sequence.length - 1; i >= 0; i--) {
            if (carry) {
                if (sequence[i] === 'Z') {
                    result = 'A' + result;
                    carry = true; // Continue carry for next character in sequence
                } else {
                    result = String.fromCharCode(sequence.charCodeAt(i) + 1) + result;
                    carry = false; // Stop carry if no overflow
                }
            } else {
                result = sequence[i] + result; // Add remaining unchanged characters
            }
        }
        if (carry) result = 'A' + result; // Add an 'A' if we have an overflow (e.g., ZZ -> AAA)
        return result;
    }

    if (referenceId === 'EMP') {
        // Handle cases like EMP<number><letter>
        const latestReference = await Scheme.aggregate([
            { $unwind: "$customerData" },
            { $match: { "customerData.referenceId": { $regex: /^EMP\d+[A-Z]+$/ } } },
            {
                $addFields: {
                    numericPart: {
                        $convert: {
                            input: {
                                $substrCP: [
                                    "$customerData.referenceId",
                                    3,
                                    { $subtract: [{ $strLenCP: "$customerData.referenceId" }, 4] }
                                ]
                            },
                            to: "int",
                            onError: null,
                            onNull: null
                        }
                    }
                }
            },
            { $sort: { numericPart: -1 } },
            { $limit: 1 },
            { $project: { "customerData.referenceId": 1 } }
        ]);

        if (latestReference.length === 0) {
            return 'EMP1A';
        }

        console.log('Last referenceId found:', latestReference[0].customerData.referenceId);

        const match = latestReference[0].customerData.referenceId.match(/^EMP(\d+)[A-Z]+$/);
        if (match) {
            let number = parseInt(match[1], 10) + 1;
            return `EMP${number}A`;
        }
    } else {
        const match = referenceId.match(/^EMP((\d+[A-Z]+)+)$/);
        if (!match) {
            throw new Error("Invalid referenceId format");
        }

        let currentId = match[1];

        // Find the latest referenceId that matches the pattern in the customerData array
        const latestReference = await Scheme.aggregate([
            { $unwind: "$customerData" },
            {
                $match: {
                    "customerData.referenceId": {
                        $regex: new RegExp(`^EMP${currentId}\\d+[A-Z]+$`)
                    }
                }
            },
            {
                $project: {
                    customerData: 1,
                    lastNumberMatch: {
                        $regexFind: {
                            input: "$customerData.referenceId",
                            regex: /\d+(?=[A-Z]+$)/ // Matches the last numeric part before letters
                        }
                    }
                }
            },
            {
                $addFields: {
                    numericPart: {
                        $toInt: "$lastNumberMatch.match" // Convert the matched number to an integer
                    }
                }
            },
            { $sort: { numericPart: -1 } },
            { $limit: 1 },
            { $project: { "customerData.referenceId": 1, numericPart: 1 } }
        ]);

        if (latestReference.length === 0) {
            // If no reference found, start with EMP<number><letter sequence>
            const lastLetters = currentId.match(/[A-Z]+$/)[0]; // Match the last sequence of letters
            const nextLetters = incrementSequence(lastLetters);
            return `EMP${currentId}1${nextLetters}`;
        }

        console.log('Last referenceId found:', latestReference[0].customerData.referenceId);

        const innerMatch = latestReference[0].customerData.referenceId.match(new RegExp(`^EMP${currentId}(\\d+)([A-Z]+)$`));
        if (innerMatch) {
            let [__, lastNumber, lastLetters] = innerMatch;
            lastNumber = parseInt(lastNumber, 10) + 1; // Increment the full numeric part
            return `EMP${currentId}${lastNumber}${lastLetters}`;
        }
    }

    throw new Error('Invalid referenceId format');
};

exports.addCustomers = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction(); // Start transaction
    const schemeId = req.body.id; // The schemeId to which customers will be added

    const customerDataArray = Array.isArray(req.body.customers) ? req.body.customers : [req.body];

    try {
        // Mobile number limit logic
        for (const customer of customerDataArray) {
            if (customer && customer.customerMobile) {
                // Count how many times this mobile number has been added across all schemes
                const customerMobileCount = await Scheme.aggregate([
                    { $unwind: "$customerData" }, // Unwind the customerData array
                    { $match: { "customerData.customerMobile": customer.customerMobile } }, // Match the mobile number
                    { $count: "count" } // Count occurrences
                ]);

                // Check if mobile number has been used more than 3 times
                const count = customerMobileCount.length > 0 ? customerMobileCount[0].count : 0;

                if (count >= 3) {
                    await session.abortTransaction(); // Abort transaction if limit exceeded
                    session.endSession(); // End the session
                    return res.status(400).json({ error: `Limit exceeded for customer mobile: ${customer.customerMobile}` });
                }
            }
        }

        // Prepare to store the customer data
        const newCustomers = [];

        // Iterate over customer data to generate referenceId and prepare new customer data
        for (const customer of customerDataArray) {
            const referenceId = await generateReferenceId(customer.referenceId || 'EMP'); // Generate referenceId
            const newCustomer = {
                ...customer,
                referenceId, // Add the generated referenceId to the customer data
            };
            newCustomers.push(newCustomer); // Collect the new customer data
        }

        // Update the Scheme collection with new customers
        const updatedScheme = await Scheme.findByIdAndUpdate(
            schemeId,
            {
                $push: { customerData: { $each: newCustomers } }
            },
            { new: true, useFindAndModify: false, session }
        );

        if (!updatedScheme) {
            await session.abortTransaction(); // Abort transaction if update fails
            session.endSession();
            return res.status(404).json({ error: 'Scheme not found' });
        }

        // Iterate over the newly created customers to insert into Reference collection
        for (const customer of newCustomers) {
            const newReference = new Reference({
                id: schemeId, // Set the id to the schemeId
                customerId: customer.customerId, // Reference to the Scheme document
                customerName: customer.customerName,
                customerMobile: customer.customerMobile,
                request: 'no',
                referenceId: customer.referenceId // Add the generated referenceId to the Reference
            });

            // Save the new reference to the database
            await newReference.save({ session });
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ updatedScheme, message: 'Customers and references added successfully' });
    } catch (error) {
        // Rollback the transaction in case of error
        await session.abortTransaction();
        session.endSession();
        console.error('Error details:', error);
        res.status(500).json({ error: 'Failed to update Scheme and References', details: error.message });
    }
};

exports.addRefDetails = async (req, res) => {
    try {
        const { customerDetails, otherCustomers } = req.body;
        const { customerName, referenceId } = customerDetails;

        console.log("Selected customer details:", customerDetails);
        console.log("Other customer data:", otherCustomers);

        // Find the specific customer in the Reference collection by customerName and referenceId
        const referenceCustomer = await Reference.findOne({
            customerName,
            referenceId
        });

        if (!referenceCustomer) {
            return res.status(404).json({ error: "Customer not found in reference collection" });
        }

        // Check if the request field is already set to 'yes'
        if (referenceCustomer.request === 'yes') {
            return res.status(400).json({ message: "Request already marked as 'yes'. No update needed." });
        }

        // Set the request field to 'yes' before updating references
        referenceCustomer.request = 'yes';

        // Iterate over otherCustomers and add each to referenceDetails array
        otherCustomers.forEach((customer) => {
            referenceCustomer.referenceDetails.push({
                referenceId: customer.referenceId,
                referenceMobile: customer.referenceNumber,
                referenceName: customer.referenceName,
                referenceAmount: customer.referenceAmount,
                schemePurchaseId: customer.schemePurchaseId
            });
        });

        // Save the updated reference document
        await referenceCustomer.save();

        // Send a success response back to the frontend
        res.status(200).json({
            message: "All customer references updated successfully",
        });
    } catch (err) {
        console.error("Error updating customer references:", err);
        res.status(500).json({ error: "Failed to update customer references", details: err.message });
    }
};

exports.getRefDetails = async (req, res) => {
    try {
        const { customerId, referenceId } = req.query;

        let query = {};

        // If query params exist, add them to the search filter
        if (customerId) {
            query.customerId = customerId;
        }
        if (referenceId) {
            query.referenceId = referenceId;
        }

        // Find references based on the query
        const references = await Reference.find(query);

        if (!references || references.length === 0) {
            return res.status(404).json({
                message: "No references found for the given query parameters",
            });
        }

        // Send response with the found references
        res.status(200).json({
            message: "References retrieved successfully",
            data: references
        });
    } catch (err) {
        console.error("Error fetching references:", err);
        res.status(500).json({ error: "Failed to fetch references", details: err.message });
    }
};

exports.getCusDetailsaa = async (req, res) => {
    try {
        // Get page and limit from query params, with defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Fetch all schemes
        const schemes = await Scheme.find();

        // Array to store each individual matched reference detail as a separate item
        const matchedData = [];

        // Loop through each scheme and collect matchedData as before
        for (const scheme of schemes) {
            for (const customer of scheme.customerData) {
                const { customerName, schemePurchaseId } = customer;
                const references = await Reference.find({
                    referenceDetails: {
                        $elemMatch: {
                            referenceName: customerName,
                            schemePurchaseId: schemePurchaseId
                        }
                    }
                });

                for (const reference of references) {
                    reference.referenceDetails.forEach(detail => {
                        if (detail.referenceName === customerName && detail.schemePurchaseId === schemePurchaseId) {
                            matchedData.push({
                                referenceId: reference._id,
                                customerId: reference.customerId,
                                customerName: reference.customerName,
                                request: reference.request,
                                matchedDetail: detail
                            });
                        }
                    });
                }
            }
        }

        // Group and sum data as before
        const groupedData = matchedData.reduce((acc, item) => {
            const { referenceName, referenceAmount, schemePurchaseId, referenceMobile } = item.matchedDetail;
            const key = `${referenceName}_${referenceMobile}`;
            const amount = parseFloat(referenceAmount) || 0;

            if (!acc[key]) {
                acc[key] = { referenceName, schemePurchaseId, referenceMobile, referenceAmount: 0 };
            }

            acc[key].referenceAmount += amount;
            return acc;
        }, {});

        const groupedArray = Object.values(groupedData);

        // Implement pagination
        const startIndex = (page - 1) * limit;
        const paginatedData = groupedArray.slice(startIndex, startIndex + limit);

        // Calculate total pages
        const totalItems = groupedArray.length;
        const totalPages = Math.ceil(totalItems / limit);

        // Send paginated data as response
        res.status(200).json({
            message: 'Paged customer references found successfully',
            data: paginatedData,
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit
        });
    } catch (error) {
        console.error('Error fetching customer details:', error);
        res.status(500).json({ message: 'Error processing customer details', error });
    }
};

exports.getCusDetails = async (req, res) => {
    try {
        // Get page and limit from query params, with defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Fetch all schemes
        const schemes = await Scheme.find();

        // Array to store each individual matched reference detail as a separate item
        const matchedData = [];

        // Loop through each scheme and collect matchedData as before
        for (const scheme of schemes) {
            for (const customer of scheme.customerData) {
                const { customerName, schemePurchaseId, referenceMobile} = customer;
                const references = await Reference.find({
                    referenceDetails: {
                        $elemMatch: {
                            referenceName: customerName,
                            // referenceMobile: referenceMobile,
                            schemePurchaseId: schemePurchaseId
                        }
                    }
                });

                for (const reference of references) {
                    reference.referenceDetails.forEach(detail => {
                        // if (detail.referenceName === customerName && detail.referenceMobile === referenceMobile) {
                        if (detail.referenceName === customerName && detail.schemePurchaseId === schemePurchaseId) {
                            matchedData.push({
                                referenceId: reference._id,
                                customerId: reference.customerId,
                                customerName: reference.customerName,
                                request: reference.request,
                                matchedDetail: detail
                            });
                        }
                    });
                }
            }
        }

        // Send raw matched data before summation
        const rawMatchedData = matchedData.map(item => ({
            referenceId: item.referenceId,
            customerId: item.customerId,
            customerName: item.customerName,
            request: item.request,
            matchedDetail: {
                referenceName: item.matchedDetail.referenceName,
                referenceAmount: parseFloat(item.matchedDetail.referenceAmount) || 0,
                schemePurchaseId: item.matchedDetail.schemePurchaseId,
                referenceMobile: item.matchedDetail.referenceMobile
            }
        }));

        // Group and sum data
        const groupedData = matchedData.reduce((acc, item) => {
            const { referenceName, referenceAmount, schemePurchaseId, referenceMobile } = item.matchedDetail;
            const key = `${referenceName}_${referenceMobile}`;
            const amount = parseFloat(referenceAmount) || 0;

            if (!acc[key]) {
                acc[key] = { referenceName, schemePurchaseId, referenceMobile, referenceAmount: 0 };
            }

            acc[key].referenceAmount += amount;
            return acc;
        }, {});

        const groupedArray = Object.values(groupedData);

        // Implement pagination
        const startIndex = (page - 1) * limit;
        const paginatedData = groupedArray.slice(startIndex, startIndex + limit);

        // Calculate total pages
        const totalItems = groupedArray.length;
        const totalPages = Math.ceil(totalItems / limit);

        // Send paginated data and raw matched data as response
        res.status(200).json({
            message: 'Paged customer references found successfully',
            rawMatchedData, // All raw matching details
            paginatedData, // Grouped and summed data
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit
        });
    } catch (error) {
        console.error('Error fetching customer details:', error);
        res.status(500).json({ message: 'Error processing customer details', error });
    }
};


exports.searchReferenceId = async (req, res) => {
    try {
        const { referenceId, customerName, customerMobile, schemePurchaseId } = req.query;

        if (!referenceId || !customerName || !customerMobile || !schemePurchaseId) {
            return res.status(400).json({ error: "All parameters are required" });
        }

        console.log("Clicked Details:");
        console.log("ReferenceId:", referenceId);
        console.log("Customer Name:", customerName);
        console.log("Customer Mobile:", customerMobile);
        console.log("Scheme Purchase ID:", schemePurchaseId);

        const minLength = 3;
        const maxLevel = 14;

        const placeholderData = {
            customerName: "Empair",
            referenceId: "EMP",
            customerMobile: 9999999999,
            schemePurchaseId: "EMP01",
        };

        const lengthToAmountMap = {
            level1: 500,
            level2: 125,
            level3: 75,
            level4: 25,
            level5: 15,
            level6: 5,
            level7: 5,
            level8: 5,
            level9: 5,
            level10: 5,
            level11: 5,
            level12: 5,
            level13: 5,
            level14: 5,
        };

        const removeLastNumberAndLetter = (id) => {
            const regexPattern = /(\d+[A-Za-z]+)$/;
            return regexPattern.test(id) ? id.replace(regexPattern, "") : id;
        };

        const findMatchesForLevels = async (id) => {
            let currentId = removeLastNumberAndLetter(id);
            const results = [];

            for (let level = 1; level <= maxLevel; level++) {
                if (currentId === "EMP" || currentId.length < minLength) {
                    break;
                }

                const matches = await Scheme.aggregate([
                    { $unwind: "$customerData" },
                    {
                        $match: {
                            "customerData.referenceId": currentId,
                        },
                    },
                    {
                        $project: {
                            customerName: "$customerData.customerName",
                            referenceId: "$customerData.referenceId",
                            customerMobile: "$customerData.customerMobile",
                            schemePurchaseId: "$customerData.schemePurchaseId",
                        },
                    },
                ]);

                if (matches.length > 0) {
                    matches.forEach((match) => {
                        results.push({
                            ...match,
                            Length: `level${level}`,
                            referenceAmount: lengthToAmountMap[`level${level}`],
                        });
                    });
                } else {
                    results.push({
                        ...placeholderData,
                        Length: `level${level}`,
                        referenceAmount: lengthToAmountMap[`level${level}`],
                    });
                }

                currentId = removeLastNumberAndLetter(currentId);
            }

            for (let level = results.length + 1; level <= maxLevel; level++) {
                results.push({
                    ...placeholderData,
                    Length: `level${level}`,
                    referenceAmount: lengthToAmountMap[`level${level}`],
                });
            }

            return results;
        };

        const searchResults = await findMatchesForLevels(referenceId);

        res.status(200).json({
            message: "Search results",
            queryDetails: { referenceId, customerName, customerMobile, schemePurchaseId },
            data: searchResults,
        });
    } catch (error) {
        console.error("Error searching reference ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

