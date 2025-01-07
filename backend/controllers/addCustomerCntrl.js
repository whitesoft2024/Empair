const Customer = require("../models/addCustomerModel");
// const CounterModel = require("../models/counterSchema");

const incrementLastFiveDigits = (customerId) => {
  return membershipId.replace(/\d{5}$/, match => {
    const incremented = parseInt(match) + 1;
    return incremented.toString().padStart(5, '0');
  });
};

exports.create = async (req, res) => {
  try {
    // Check if the customerMobile already exists
    const existingCustomer = await Customer.findOne({ customerMobile: req.body.customerMobile });
    
    if (existingCustomer) {
      return res.status(400).json({ message: 'This customer mobile number is already registered.' });
    }

    const newCustomer = new Customer({ ...req.body });
    await newCustomer.save();
    res.status(201).json({ message: 'Form data saved successfully' });

  } catch (error) {
    console.error('Error saving form data:', error);

    // Check if error is validation-related
    if (error.name === 'ValidationError') {
      const errorMessage = error.errors.customerMobile
        ? error.errors.customerMobile.message
        : 'Invalid data';
      return res.status(400).json({ message: errorMessage });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) ;
    const searchTerm = req.query.searchTerm;
    const date = req.query.date;

    let query = {};

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      query.$or = [
        { customerName: searchRegex },
        { customerId: searchRegex },
        { customerMobile: searchRegex }
      ];
    }

    if (date) {
      query.date = date;
    }

    const total = await Customer.countDocuments(query);
    const data = await Customer.find(query)
      .sort({ customerId: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    
    let nextPage = null;
    if (total > page * limit) {
      nextPage = page + 1;
    }

    res.json({ data, nextPage, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};