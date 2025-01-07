const express = require('express');
const router = express.Router();

const  loginData  = require('../controllers/RegController');

router.post('/api/Register',loginData.createRegister);
router.post('/api/loginData',loginData.createLog);

module.exports = router;