// routes/membershipRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/addCustomerCntrl')

router.post('/api/customers', customerController.create)

router.get('/api/getCustomers', customerController.getAll)

// router.put('/membership/:id', membershipController.updateAll)

module.exports = router;