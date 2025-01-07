const crypto = require('crypto');
const userRegister = require("../models/loginModel")
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); 

exports.addUser = async (req, res) => {
    try {
        const newSignupuser = new userRegister(req.body);
        await newSignupuser.save();
        res.status(200).json({ message: 'Signup added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//send otp
exports.sendOtp = async (req, res) => {
    try {
        const { email, username,mobileNo } = req.body;

        // Generate OTP
        const otp = crypto.randomInt(1000, 9999).toString();

        // Save OTP and expiration time in the database
        const user = await userRegister.findOneAndUpdate(
            { email }, // Find the user by email
            {
                $set: {
                    email,
                    username,
                    mobileNo,
                    otp,
                    otpExpires: Date.now() + 60 * 1000 // OTP expires in 1 minute
                }
            },
            { upsert: true, new: true } // Create a new user if not exists, and return the updated document
        );

        // Send OTP to user's email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'whitepayteam@gmail.com', // Replace with your email
                pass: 'sykxcvhditrvilzx', // Replace with your app password
            },
        });

        const mailOptions = {
            from: '"EmpairIndia" <whitepayteam@gmail.com>', // Replace with your email
            to: email,
            subject: 'Your OTP Code',
            html: `
              <html>
                <head>
                  <style>
                    .container {
                      font-family: Arial, sans-serif;
                      padding: 20px;
                      background-color: #f4f4f4;
                      border-radius: 5px;
                      max-width: 600px;
                      margin: auto;
                    }
                    .header {
                      background-color: #007bff;
                      color: white;
                      padding: 10px;
                      text-align: center;
                      border-radius: 5px 5px 0 0;
                    }
                    .content {
                      padding: 20px;
                      text-align: center;
                    }
                    .footer {
                      font-size: 12px;
                      color: #777;
                      text-align: center;
                      padding: 10px;
                      border-top: 1px solid #ddd;
                    }
                    .otp {
                      font-size: 24px;
                      font-weight: bold;
                      color: #007bff;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>EmpairIndia</h1>
                    </div>
                    <div class="content">
                      <p>Hello,</p>
                      <p>Your OTP code is <span class="otp">${otp}</span>. It expires in 1 minute.</p>
                      <p>If you did not request this, please ignore this email.</p>
                    </div>
                    <div class="footer">
                      <p>&copy; 2024 EmpairIndia. All rights reserved.</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
        };

        await transporter.sendMail(mailOptions);

        // Schedule OTP deletion after 1 minute
        setTimeout(async () => {
            await userRegister.updateOne({ email }, { $unset: { otp: 1, otpExpires: 1 } });
            console.log(`OTP for ${email} has been deleted`);
        }, 60 * 1000); // 1 minute in milliseconds

        res.status(200).json({ message: 'OTP sent to your email', otp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Verify OTP and move to password creation step
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find the user with the email and valid OTP
        const user = await userRegister.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // OTP is valid, proceed to next step (Case 2: Password creation)
        res.status(200).json({ message: 'OTP verified. Proceed to password creation.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Save password after OTP verification
exports.savePassword = async (req, res) => {
    const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Find the user by email and update their password
        const user = await userRegister.findOneAndUpdate(
          { email: email },
          { password: hashedPassword },
          { new: true } // Returns the updated document
        );
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        res.status(200).json({ message: 'Password updated successfully' });
      } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error' });
      }
};

// Backend API for login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await userRegister.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the provided password matches the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // If login is successful, send response (you can also generate a JWT token if needed)
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, 'yourSecretKey');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};