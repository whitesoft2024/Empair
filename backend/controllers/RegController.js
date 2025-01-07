const Customer = require ('../models/RegModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register Endpoint
exports.createRegister = async (req, res) => {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
        return res.status(400).json({ message: 'Mobile number and password are required' });
    }

    try {
        const user = new Customer({ mobileNumber, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Mobile number already exists' });
        } else {
            res.status(500).json({ message: 'Error registering user', error: err.message });
        }
    }
};

exports.createLog = async (req, res) => {
    
    console.log('Login endpoint hit with data:', req.body);

    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
        return res.status(400).json({ message: 'Mobile number and password are required' });
    }

    try {
        const user = await Customer.findOne({ mobileNumber });

        if (!user) {
            return res.status(400).json({ message: 'Invalid mobile number or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid mobile number or password' });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};

