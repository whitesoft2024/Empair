const Customer = require ('../models/PosBck.js');

// Helper function to generate unique 12-digit BillNo
const generateBillNo = async () => {
  const latestTransaction = await Customer.findOne()
    .sort({ 'transactions.BillNo': -1 }) // Sort by BillNo in descending order
    .select('transactions.BillNo')
    .lean();

  let lastBillNo = latestTransaction?.transactions?.[0]?.BillNo || '000000000000';
  let nextBillNo = (parseInt(lastBillNo, 10) + 1).toString().padStart(12, '0');
  
  return nextBillNo;
};

// Helper function to generate unique TransactionId
const generateTransactionId = async (transactionType) => {
  const prefix = transactionType.slice(0, 3).toUpperCase(); // First 3 letters of TransactionType
  const latestTransaction = await Customer.findOne()
    .sort({ 'transactions.TransactionId': -1 }) // Sort by TransactionId in descending order
    .select('transactions.TransactionId')
    .lean();

  let lastTransactionId = latestTransaction?.transactions?.[0]?.TransactionId || `${prefix}000000000`;
  let numericPart = parseInt(lastTransactionId.slice(3), 10) + 1; // Increment numeric part
  let nextTransactionId = `${prefix}${numericPart.toString().padStart(9, '0')}`;

  return nextTransactionId;
};

// Controller function to create a customer entry
exports.createCustomer = async (req, res) => {
  try {
    const { CustomerName, CustomerMobile, transactions } = req.body;

    if (!CustomerName || !CustomerMobile || !transactions || transactions.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Process transactions array
    for (let transaction of transactions) {
      // Generate unique BillNo if not provided
      if (!transaction.BillNo) {
        transaction.BillNo = await generateBillNo();

        // Verify uniqueness
        const existingBill = await Customer.findOne({ 'transactions.BillNo': transaction.BillNo });
        if (existingBill) {
          return res.status(400).json({ message: 'BillNo already exists, try again.' });
        }
      }

      // Generate unique TransactionId if not provided
      if (!transaction.TransactionId) {
        if (!transaction.TransactionType) {
          return res.status(400).json({ message: 'TransactionType is required to generate TransactionId' });
        }
        transaction.TransactionId = await generateTransactionId(transaction.TransactionType);

        // Verify uniqueness
        const existingTransaction = await Customer.findOne({ 'transactions.TransactionId': transaction.TransactionId });
        if (existingTransaction) {
          return res.status(400).json({ message: 'TransactionId already exists, try again.' });
        }
      }
    }

    // Create new customer entry
    const newCustomer = new Customer({
      CustomerName,
      CustomerMobile,
      transactions
    });

    await newCustomer.save();

    res.status(201).json({ message: 'Customer created successfully', data: newCustomer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Get customer details by BillNo
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