import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Button, TextField, Box, Typography, Grid, Avatar, Stepper, Step, StepLabel } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './Style/Register.css'; // Ensure you create a corresponding CSS file

const steps = ['Account Details', 'Personal Information', 'Address', 'Password'];

const Register = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        mobileNo: '',
        address:'',
        password: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);
    const [activeStep, setActiveStep] = useState(0);
    const handleStepChange = (event, newValue) => {
      setStep(newValue);
    };
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:2024/api/auth/register', formData);
            setMessage(response.data.message);
            navigate('/login'); 
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Registration failed. Please try again.');
            }
        }
    };
    const getStepContent = (step) => {
      switch (step) {
        case 0:
          return (
            <>
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                InputProps={{
                  style: { borderRadius: "8px" }
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  style: { borderRadius: "8px" }
                }}
              />
            </>
          );
        case 1:
          return (
            <>
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Mobile Number"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                required
                InputProps={{
                  style: { borderRadius: "8px" }
                }}
              />
            </>
          );
        case 2:
          return (
            <>
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                InputProps={{
                  style: { borderRadius: "8px" }
                }}
              />
            </>
          );
        case 3:
          return (
            <>
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  style: { borderRadius: "8px" }
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                InputProps={{
                  style: { borderRadius: "8px" }
                }}
              />
            </>
          );
        default:
          return 'Unknown step';
      }
    };
     

    return (
      <Container component="main" className="register-container">
      <Box className="register-left">
        <Typography component="h1" variant="h3" className="welcome-text">
          Join Us!
        </Typography>
        <Typography component="p" className="info-text">
          Create an account to start using our application.
        </Typography>
      </Box>
      <Card className="register-right">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar className="register-avatar">
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="register-title">
            Register
          </Typography>
          {message && <Alert severity="error" style={{ width: '100%', marginTop: '1rem' }}>{message}</Alert>}
          <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
            <Stepper activeStep={activeStep} style={{ marginBottom: "1rem" }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {getStepContent(activeStep)}
            <Box display="flex" justifyContent="space-between" style={{ marginTop: "1rem" }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} className="register-button">
                  Back
                </Button>
              )}
              {activeStep === steps.length - 1 ? (
                <Button type="submit" className="register-button">
                  Register
                </Button>
              ) : (
                <Button onClick={handleNext} className="register-button">
                  Next
                </Button>
              )}
            </Box>
            <Grid container justifyContent="space-between" style={{ marginTop: "1rem" }}>
              <Grid item>
                <Link to="/login" className="link-text">
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Card>
    </Container>
    );
};

export default Register;
