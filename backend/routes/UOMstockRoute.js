// routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const UOMController = require('../controllers/UOMstockcntrl');

router.post('/api/addUOM', UOMController.addUOM);
router.get('/api/getAllUOM', UOMController.getAllUOM);

module.exports = router;
