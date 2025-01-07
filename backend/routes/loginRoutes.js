const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginCntrl');

router.post('/api/addLogin', loginController.addUser);
router.post('/api/send-otp', loginController.sendOtp);
router.post('/api/verify-otp', loginController.verifyOtp);
router.post('/api/update-password', loginController.savePassword);
router.post('/api/login', loginController.loginUser);
// router.post('/api/setReg', loginController.verifyOtpAndSavePassword);
// router.get('/api/getAllGroup', loginController.getAllGroup);

module.exports = router;
