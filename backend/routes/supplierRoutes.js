// routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.post('/api/addSupplier', supplierController.addSupplier);
router.get('/api/getAllSuppliers', supplierController.getAllSuppliers);
router.post('/api/purchaseData', supplierController.addPurchaseData);
router.get('/api/getPurchaseData', supplierController.getPurchaseData);
router.get('/api/getItemsData', supplierController.getItemsData);

module.exports = router;
