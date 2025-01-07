const SchemeStock = require('../models/addSchemeModel');

exports.addScheme = async (req, res) => {
    const schemeData = req.body;
    console.log(req.body.SchemeName);
    console.log(req.body.isActive);

    const newScheme = new SchemeStock({
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
        const SchemeName = await SchemeStock.find();
        res.status(200).json(SchemeName);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get SchemeName' });
    }
};

exports.getReference = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchTerm = req.query.searchTerm;

        let query = {};

        if (searchTerm) {
            // Adjust the query to search within the 'customerName' field inside customerData
            query.customerData = {
                $elemMatch: {
                    customerName: { $regex: searchTerm, $options: 'i' }
                }
            };
        }

        const total = await SchemeStock.countDocuments(query);
        const data = await SchemeStock.find(query)
            .select('customerData') // Only select the customerData field
            .sort({ _id: 1 }) // Assuming you want to sort by document ID for simplicity
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

exports.addProducts = async (req, res) => {
    const schemeData = req.body;
    const schemeId = req.body.id;
    const productsDataArray = req.body.items;

    try {
        const updatedScheme = await SchemeStock.findByIdAndUpdate(
            schemeId,
            {
                invoiceNumber: schemeData.invoiceNumber,
                schemeBarCode: schemeData.schemeBarCode,
                invoiceDate: schemeData.invoiceDate,
                itemDescription: schemeData.itemDescription,
                $push: { productsData: { $each: productsDataArray } }
            },
            { new: true, useFindAndModify: false }
        );

        if (!updatedScheme) {
            return res.status(404).json({ error: 'Scheme not found' });
        }

        res.status(200).json(updatedScheme);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update Scheme' });
    }
};

exports.addCustomers = async (req, res) => {
    const schemeId = req.body.id;
    const schemeName = req.body.SchemeName;
    const customerDataArray = Array.isArray(req.body.customers) ? req.body.customers : [req.body];

    try {
        let nextReferenceId;
        const baseReferenceId = req.body.referenceId || 'EMP';

        // Mobile number limit logic
        for (const customer of customerDataArray) {
            if (customer && customer.customerMobile) {
                // Count how many times this mobile number has been added
                const customerMobileCount = await SchemeStock.countDocuments({
                    "customerData.customerMobile": customer.customerMobile
                });

                // If the customer mobile already exists in 2 accounts, block the creation and return an error message
                if (customerMobileCount >= 2) {
                    return res.status(400).json({ error: `Limit exceeded for customer mobile: ${customer.customerMobile}` });
                }
            }
        }

        // Handle case when baseReferenceId is "EMP" (focus on alphabetic increments)
        if (baseReferenceId === 'EMP') {
            // Find all referenceIds that start with "EMP" and have any mix of letters and numbers
            const allCustomers = await SchemeStock.find({
                "customerData.referenceId": { $regex: /^EMP[A-Z0-9]*$/ } // Match EMP followed by any mix of letters and numbers
            })
                .sort({ "customerData.referenceId": 1 }) // Sort alphabetically
                .exec();

            let lastAlphabeticId = 'EMPA'; // Default to EMPA if no valid alphabetic referenceId is found

            if (allCustomers && allCustomers.length > 0) {
                // Loop through all found customers
                allCustomers.forEach(customer => {
                    customer.customerData.forEach(cust => {
                        const refId = cust.referenceId;
                        // Extract only the alphabetic part of the referenceId (ignore digits)
                        const alphabeticPart = refId.match(/^EMP[A-Z]+/);

                        if (alphabeticPart && alphabeticPart[0] > lastAlphabeticId) {
                            lastAlphabeticId = alphabeticPart[0]; // Update if this is a higher alphabetic ID
                        }
                    });
                });

                // Now we have the last purely alphabetic referenceId, e.g., EMPB
                const lastSequence = lastAlphabeticId.slice(3); // Get the part after EMP
                let sequenceArray = lastSequence.split(''); // Split into an array for manipulation

                // Increment the alphabetic sequence
                let carry = true;
                for (let i = sequenceArray.length - 1; i >= 0; i--) {
                    if (carry) {
                        if (sequenceArray[i] === 'Z') {
                            sequenceArray[i] = 'A';  // Loop from Z to A
                        } else {
                            sequenceArray[i] = String.fromCharCode(sequenceArray[i].charCodeAt(0) + 1);  // Increment character
                            carry = false;
                        }
                    }
                }

                if (carry) {
                    sequenceArray.unshift('A'); // Add a new 'A' if all characters were 'Z'
                }

                nextReferenceId = `EMP${sequenceArray.join('')}`; // Construct the next referenceId
            } else {
                nextReferenceId = 'EMPA'; // Default to EMPA if no matching referenceId is found
            }
        }
        else {
            // Handle case when baseReferenceId is provided (like EMPB)
            const regex = new RegExp(`^${baseReferenceId}(\\d+)$`); // Match EMPB with a number (e.g., EMPB1, EMPB2)

            const lastCustomer = await SchemeStock.findOne({
                "customerData.referenceId": { $regex: regex }
            })
                .sort({ "customerData.referenceId": -1 })
                .exec();

            let nextNumber = 1;

            if (lastCustomer && lastCustomer.customerData && lastCustomer.customerData.length > 0) {
                const lastReferenceId = lastCustomer.customerData.reduce((maxId, customer) => {
                    const match = customer.referenceId.match(regex);
                    const num = match ? parseInt(match[1], 10) : 0;
                    return num > maxId ? num : maxId;
                }, 0);

                nextNumber = lastReferenceId + 1;
            }

            nextReferenceId = `${baseReferenceId}${nextNumber}`;
        }

        // Uniqueness check: Ensure referenceId doesn't already exist
        let isUnique = false;
        while (!isUnique) {
            const existingCustomer = await SchemeStock.findOne({
                "customerData.referenceId": nextReferenceId
            }).exec();

            if (!existingCustomer) {
                isUnique = true;  // If no customer has this referenceId, it's unique
            } else {
                // Generate a new referenceId if the current one exists
                if (baseReferenceId === 'EMP') {
                    const lastSequence = nextReferenceId.slice(3);
                    let sequenceArray = lastSequence.split('');
                    let carry = true;
                    for (let i = sequenceArray.length - 1; i >= 0; i--) {
                        if (carry) {
                            if (sequenceArray[i] === 'Z') {
                                sequenceArray[i] = 'A';
                            } else {
                                sequenceArray[i] = String.fromCharCode(sequenceArray[i].charCodeAt(0) + 1);
                                carry = false;
                            }
                        }
                    }
                    if (carry) {
                        sequenceArray.unshift('A');
                    }
                    nextReferenceId = `EMP${sequenceArray.join('')}`;
                } else {
                    const nextNumber = parseInt(nextReferenceId.slice(baseReferenceId.length), 10) + 1;
                    nextReferenceId = `${baseReferenceId}${nextNumber}`;
                }
            }
        }

        // Assign unique reference IDs to customers
        customerDataArray.forEach((customer, index) => {
            if (customer && typeof customer === 'object') {
                customer.referenceId = nextReferenceId;

                // Generate the next referenceId if multiple customers are being added
                if (baseReferenceId === 'EMP') {
                    const lastSequence = nextReferenceId.slice(3);
                    let sequenceArray = lastSequence.split('');
                    let carry = true;
                    for (let i = sequenceArray.length - 1; i >= 0; i--) {
                        if (carry) {
                            if (sequenceArray[i] === 'Z') {
                                sequenceArray[i] = 'A';
                            } else {
                                sequenceArray[i] = String.fromCharCode(sequenceArray[i].charCodeAt(0) + 1);
                                carry = false;
                            }
                        }
                    }
                    if (carry) {
                        sequenceArray.unshift('A');
                    }
                    nextReferenceId = `EMP${sequenceArray.join('')}`;
                } else {
                    const nextNumber = parseInt(nextReferenceId.slice(baseReferenceId.length), 10) + 1;
                    nextReferenceId = `${baseReferenceId}${nextNumber}`;
                }
            } else {
                console.error(`Invalid customer data at index ${index}`, customer);
            }
        });

        // Example: Inserting customer data only after the validation passes.
        const updatedScheme = await SchemeStock.findByIdAndUpdate(
            schemeId,
            {
                $push: { customerData: { $each: customerDataArray } }
            },
            { new: true, useFindAndModify: false }
        );

        if (!updatedScheme) {
            return res.status(404).json({ error: 'Scheme not found' });
        }

        res.status(200).json(updatedScheme);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ error: 'Failed to update Scheme', details: error.message });
    }
};
