// routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandStockcntrl');

router.post('/api/addBrand', brandController.addbrand);
router.get('/api/getAllBrand', brandController.getAllbrand);

module.exports = router;
