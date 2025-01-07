// ReferenceId generating method EMP and if i send EMPAA 

// exports.addCustomers = async (req, res) => {
//     const schemeId = req.body.id;
//     const schemeName = req.body.SchemeName; // Assuming schemeName is passed from the frontend
//     const customerDataArray = Array.isArray(req.body.customers) ? req.body.customers : [req.body];

//     console.log('Request body:', req.body);
//     console.log('Customer data array:', customerDataArray);

//     try {
//         let nextReferenceId;
//         const baseReferenceId = req.body.referenceId || 'EMP';

//         if (baseReferenceId === 'EMP') {
//             // Fetch the last referenceId starting with EMP across the entire collection
//             const lastCustomer = await SchemeStock.findOne({
//                 "customerData.referenceId": { $regex: /^EMP[A-Z]*$/ }
//             })
//             .sort({ "customerData.referenceId": -1 })
//             .exec();

//             nextReferenceId = 'EMPA'; // Default starting value

//             if (lastCustomer && lastCustomer.customerData && lastCustomer.customerData.length > 0) {
//                 const lastReferenceId = lastCustomer.customerData.reduce((maxId, customer) => {
//                     return customer.referenceId > maxId ? customer.referenceId : maxId;
//                 }, 'EMPA');

//                 const lastSequence = lastReferenceId.slice(3);
//                 let sequenceArray = lastSequence.split('');

//                 let carry = true;
//                 for (let i = sequenceArray.length - 1; i >= 0; i--) {
//                     if (carry) {
//                         if (sequenceArray[i] === 'Z') {
//                             sequenceArray[i] = 'A'; 
//                         } else {
//                             sequenceArray[i] = String.fromCharCode(sequenceArray[i].charCodeAt(0) + 1);
//                             carry = false; 
//                         }
//                     }
//                 }

//                 if (carry) {
//                     sequenceArray.unshift('A');
//                 }

//                 nextReferenceId = `EMP${sequenceArray.join('')}`;
//             }
//         } else {
//             // If the baseReferenceId is something like EMPA, check for the next available number within the same SchemeName
//             const regex = new RegExp(`^${baseReferenceId}(\\d+)$`);
//             const lastCustomer = await SchemeStock.findOne({ 
//                 "customerData.referenceId": { $regex: regex } 
//             })
//             .sort({ "customerData.referenceId": -1 })
//             .exec();

//             let nextNumber = 1;

//             if (lastCustomer && lastCustomer.customerData && lastCustomer.customerData.length > 0) {
//                 const lastReferenceId = lastCustomer.customerData.reduce((maxId, customer) => {
//                     const match = customer.referenceId.match(regex);
//                     const num = match ? parseInt(match[1], 10) : 0;
//                     return num > maxId ? num : maxId;
//                 }, 0);

//                 nextNumber = lastReferenceId + 1;
//             }

//             nextReferenceId = `${baseReferenceId}${nextNumber}`;
//         }
//         // Assign referenceId to each customer
//         customerDataArray.forEach((customer, index) => {
//             if (customer && typeof customer === 'object') {
//                 customer.referenceId = nextReferenceId;

//                 if (baseReferenceId === 'EMP') {
//                     const lastSequence = nextReferenceId.slice(3);
//                     let sequenceArray = lastSequence.split('');
//                     let carry = true;
//                     for (let i = sequenceArray.length - 1; i >= 0; i--) {
//                         if (carry) {
//                             if (sequenceArray[i] === 'Z') {
//                                 sequenceArray[i] = 'A';
//                             } else {
//                                 sequenceArray[i] = String.fromCharCode(sequenceArray[i].charCodeAt(0) + 1);
//                                 carry = false;
//                             }
//                         }
//                     }
//                     if (carry) {
//                         sequenceArray.unshift('A');
//                     }
//                     nextReferenceId = `EMP${sequenceArray.join('')}`;
//                 } else {
//                     const nextNumber = parseInt(nextReferenceId.slice(baseReferenceId.length), 10) + 1;
//                     nextReferenceId = `${baseReferenceId}${nextNumber}`;
//                 }
//             } else {
//                 console.error(`Invalid customer data at index ${index}`, customer);
//             }
//         });
//         const updatedScheme = await SchemeStock.findByIdAndUpdate(
//             schemeId,
//             {
//                 $push: { customerData: { $each: customerDataArray } }
//             },
//             { new: true, useFindAndModify: false }
//         );
//         if (!updatedScheme) {
//             return res.status(404).json({ error: 'Scheme not found' });
//         }
//         res.status(200).json(updatedScheme);
//     } catch (error) {
//         console.error('Error details:', error);
//         res.status(500).json({ error: 'Failed to update Scheme', details: error.message });
//     }
// };


// {
//     "name": "backend",
//     "version": "1.0.0",
//     "description": "",
//     "main": "app.js",
//     "scripts": {
//       "test": "echo \"Error: no test specified\" && exit 1"
//     },
//     "author": "",
//     "license": "ISC",
//     "dependencies": {
//       "bcrypt": "^5.1.1",
//       "body-parser": "^1.20.2",
//       "cors": "^2.8.5",
//       "dotenv": "^16.4.5",
//       "express": "^4.19.2",
//       "jsonwebtoken": "^9.0.2",
//       "mongoose": "^8.7.2",
//       "node-cron": "^3.0.3",
//       "nodemailer": "^6.9.15",
//       "nodemon": "^3.1.3",
//       "path": "^0.12.7"
//     }
//   }
  