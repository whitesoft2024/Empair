const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/addSchemeCntrl');

router.post('/api/addScheme', schemeController.addScheme);
router.get('/api/getAllScheme', schemeController.getAllScheme);
router.get('/api/getReference', schemeController.getReference);
router.post('/api/addProducts', schemeController.addProducts);
router.post('/api/addCustomers', schemeController.addCustomers);

module.exports = router;
