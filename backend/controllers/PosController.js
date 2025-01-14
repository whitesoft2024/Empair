const Customer = require ('../models/PosBck.js');
const Counter = require('../models/counterSchema.js');


const getNextCounter = async (field, prefix = '') => {
  const counter = await Counter.findOneAndUpdate(
    { field },
    { $inc: { counter: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const counterValue = counter.counter.toString().padStart(12, '0');
  return `${prefix}${counterValue}`;
};


// exports.createOrUpdateCustomer = async (req, res) => {
//   try {
//     const { CustomerName, CusName, CustomerMobile, CusMob, transactions } = req.body;

//     let name = CustomerName || CusName;
//     let mobile = CustomerMobile || CusMob;

//     if (!name || !mobile || !transactions || !Array.isArray(transactions)) {
//       return res.status(400).json({ message: 'Missing required fields or invalid format' });
//     }

//     // Process each transaction without grouping by TransactionType
//     const processedTransactions = await Promise.all(
//       transactions.map(async (transaction) => {
//         if (!transaction.Date || !transaction.TransactionType) {
//           throw new Error('Transaction must include Date and TransactionType');
//         }

//         if (!transaction.items || !Array.isArray(transaction.items)) {
//           throw new Error('Invalid items format: must be an array');
//         }

//         transaction.items.forEach((item) => {
//           if (!item.itemName) {
//             throw new Error('Invalid item format: missing itemName');
//           }    
//         });

//         // Generate unique BillNo
//         const billNo = await getNextCounter('BillNo');

//         // Generate unique TransactionId
//         const prefix = transaction.TransactionType.slice(0, 3).toUpperCase();
//         const transactionId = await getNextCounter('TransactionId', prefix);

//         return {
//           ...transaction,
//           BillNo: billNo,
//           TransactionId: transactionId,
//         };
//       })
//     );

//     // Create or update customer with transactions
//     const result = await Customer.updateOne(
//       { CustomerMobile: mobile },
//       {
//         $setOnInsert: { CustomerName: name, CustomerMobile: mobile },
//         $push: { transactions: { $each: processedTransactions } },
//       },
//       { upsert: true }
//     );

//     if (result.upsertedCount > 0) {
//       return res.status(201).json({
//         message: 'Customer created successfully',
//         data: { name, mobile, transactions: processedTransactions },
//       });
//     }

//     res.status(200).json({
//       message: 'Transactions added to customer history',
//       data: { name, mobile, transactions: processedTransactions },
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       const duplicateKey = Object.keys(error.keyPattern)[0];
//       return res
//         .status(400)
//         .json({ message: `Duplicate ${duplicateKey} detected. Please use a unique value.` });
//     }

//     console.error('Error updating customer:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



//cusName is taken explicitly if entered or else would be taken from he collection for previous customer

exports.createOrUpdateCustomer = async (req, res) => {
  try {
    const { CustomerName, CusName, CustomerMobile, CusMob, transactions } = req.body;

    let name = CustomerName || CusName;
    let mobile = CustomerMobile || CusMob;

    // Validate required fields
    if (!mobile || !transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ message: 'Missing required fields or invalid format' });
    }

    // Check if the customer already exists
    const existingCustomer = await Customer.findOne({ CustomerMobile: mobile });

    // If customer exists and no name is provided, use the existing name
    if (existingCustomer && !name) {
      name = existingCustomer.CustomerName;
    }

    // Validate transactions
    const processedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        if (!transaction.Date || !transaction.TransactionType) {
          throw new Error('Transaction must include Date and TransactionType');
        }

        if (!transaction.items || !Array.isArray(transaction.items)) {
          throw new Error('Invalid items format: must be an array');
        }

        transaction.items.forEach((item) => {
          if (!item.itemName) {
            throw new Error('Invalid item format: missing itemName');
          }
        });

        // Generate unique BillNo
        const billNo = await getNextCounter('BillNo');

        // Generate unique TransactionId
        const prefix = transaction.TransactionType.slice(0, 3).toUpperCase();
        const transactionId = await getNextCounter('TransactionId', prefix);

        return {
          ...transaction,
          BillNo: billNo,
          TransactionId: transactionId,
        };
      })
    );

    // Create or update customer with transactions
    const result = await Customer.updateOne(
      { CustomerMobile: mobile },
      {
        $setOnInsert: { CustomerName: name, CustomerMobile: mobile },
        $push: { transactions: { $each: processedTransactions } },
      },
      { upsert: true }
    );

    // Response for a new customer
    if (result.upsertedCount > 0) {
      return res.status(201).json({
        message: 'Customer created successfully',
        data: { name, mobile, transactions: processedTransactions },
      });
    }

    // Response for adding transactions to an existing customer
    res.status(200).json({
      message: 'Transactions added to customer history',
      data: { name, mobile, transactions: processedTransactions },
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      const duplicateKey = Object.keys(error.keyPattern)[0];
      return res
        .status(400)
        .json({ message: `Duplicate ${duplicateKey} detected. Please use a unique value.` });
    }

    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






exports.getCustomerByBillNo = async (req, res) => {
  try {
    const { billNo } = req.params;

    // Find the customer with the given BillNo in the transactions array
    const customer = await Customer.findOne({ 
      'transactions.BillNo': billNo 
    }, {
      CustomerName: 1, 
      CustomerMobile: 1, 
      transactions: { $elemMatch: { BillNo: billNo } } // Retrieve only the relevant transaction
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer with the given BillNo not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer by BillNo:', error);
    res.status(500).json({ message: 'Server error' });
  }
};