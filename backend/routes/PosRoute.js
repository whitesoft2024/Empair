const express = require('express');
const router = express.Router();
const  createPos  = require('../controllers/PosController');


// Route to create a customer with transactions
router.post('/api/createCustomer',createPos.createCustomer);

// Route to fetch customer details by BillNo
router.get('/getCustomerByBillNo/:billNo', createPos.getCustomerByBillNo);

module.exports = router;
