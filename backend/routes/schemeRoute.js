const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeCntlr');

router.post('/svv/addScheme', schemeController.addScheme);
router.get('/svv/getAllScheme', schemeController.getAllScheme);
router.get('/svv/getAllCustomers', schemeController.getAllCustomers);
router.get('/svv/getReference', schemeController.getReference);
router.post('/svv/addProducts', schemeController.addProducts);
router.post('/svv/addCustomers', schemeController.addCustomers);
router.post('/svv/addRefDetails', schemeController.addRefDetails);
router.get('/svv/sendRefDetails', schemeController.getRefDetails);
router.get('/svv/getCusDetails', schemeController.getCusDetails);
router.get('/api/searchRefId', schemeController.searchReferenceId);


module.exports = router;