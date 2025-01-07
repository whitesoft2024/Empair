const express = require('express');
const router = express.Router();
const AddItemController = require('../controllers/addItemCntrl');

router.post('/api/addItem', AddItemController.addItem);
router.get('/api/getAllItems', AddItemController.getAllItem);
router.get('/api/getItems', AddItemController.getItem);

module.exports = router;
