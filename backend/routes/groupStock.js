// routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupStock');

router.post('/api/addGroup', groupController.addGrp);
router.get('/api/getAllGroup', groupController.getAllGroup);

module.exports = router;
