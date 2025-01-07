import React, { useRef, useState ,useContext} from 'react'
import './Style/Login.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Card, Alert, Button, TextField, Box, Typography, Grid, Avatar, Stepper, Step, StepLabel } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Toaster, toast } from 'sonner'
import CircularProgress from '@mui/material/CircularProgress';
// import  {UserContext}  from './Others/UserContext'; 

export default function LoginPage() {

  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);
  const [formType, setFormType] = useState('register');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  // const { setUser } = useContext(UserContext);

  const registerBtnClick = () => {
    containerRef.current.classList.add('active');
    setFormType('register');
  };


  const loginBtnClick = () => {
    containerRef.current.classList.remove('active');
  };

  const handleNext = async (event) => {
    event.preventDefault(); // Prevent form submission

    try {
      if (activeStep === 0) {
        // Step 0: Send OTP
        if (formData.email && formData.username && formData.mobileNo) {
          setLoading(true); // Show loader
          const response = await axios.post("http://localhost:4000/api/send-otp", {
            email: formData.email,
            mobileNo: formData.mobileNo,
            username: formData.username,
          });
          console.log("OTP sent successfully");
          setActiveStep((prevActiveStep) => prevActiveStep + 1);  // Proceed to OTP step
        } else {
          alert("Please provide email, username, and mobile number.");
        }
      } else if (activeStep === 1) {
        // Step 1: Verify OTP
        const response = await axios.post("http://localhost:4000/api/verify-otp", {
          email: formData.email,
          otp: otp.join(''),
        });
        console.log("OTP verified successfully");
        setActiveStep((prevActiveStep) => prevActiveStep + 1);  // Proceed to the password step
      } else if (activeStep === 2) {
        // Step 2: Submit Password
        if (formData.password && formData.Confirm_Password) {
          if (formData.password === formData.Confirm_Password) {
            const response = await axios.post("http://localhost:4000/api/update-password", {
              email: formData.email,
              password: formData.password,
            });
            console.log("Password updated successfully");
            setActiveStep((prevActiveStep) => prevActiveStep + 1);  // Move to the success message step
          } else {
            alert("Passwords do not match.");
          }
        } else {
          alert("Please provide and confirm your password.");
        }
      } else if (activeStep === 3) {
        console.log("Successfully updated user profile");
        alert("Your profile has been updated successfully!");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loader when process is finished
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Register 

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    Confirm_Password: '',
    otp: "",
    mobileNo: "",
  });

  const Loader = () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ 
        position: 'relative', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 10, // Ensure it's on top
        backgroundColor: 'rgba(255, 255, 255, 0.8)' // Slight overlay effect
      }}
    >
      <CircularProgress />
    </Box>
  );

  const steps = ['Personal Information', 'Verification', 'Password'];
  const getStepContent = (step) => {
    return (
      <div className={`step-content ${activeStep === step ? 'active' : ''}`} style={{ position: 'relative' }}>
        {loading && <Loader />} {/* Loader will appear inside the form */}
        {step === 0 && !loading && (
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
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Mobile Number"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {  // Ensures only up to 10 digits can be entered
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    mobileNo: value,
                  }));
                }
              }}
              required
              InputProps={{
                style: { borderRadius: "8px" },
                inputProps: { maxLength: 10 },  // Ensures only 10 digits can be entered
              }}
            />
          </>
        )}

        {step === 1 && !loading && (
          <Box display="flex" justifyContent="space-between" gap={1}>
            {otp.map((digit, index) => (
              <TextField
                key={index}
                id={`otp-${index}`}
                variant="outlined"
                margin="normal"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: "center", borderRadius: "8px" }
                }}
                required
              />
            ))}
          </Box>
        )}

        {step === 2 && !loading && (
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
              name="Confirm_Password"
              type="password"
              value={formData.Confirm_Password}
              onChange={handleChange}
              required
              InputProps={{
                style: { borderRadius: "8px" }
              }}
            />
          </>
        )}

        {step === 3 && !loading && <h2>Your profile has been created!</h2>}
      </div>
    );
  };



  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [loginOtp, setLoginOtp] = useState('');
  const [isOtpVisible, setIsOtpVisible] = useState(false);


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // const handleLoginSubmit = (event) => {
  //   event.preventDefault();

  //   // Make an API call to the login endpoint
  //   axios.post("http://localhost:4000/api/login", { email, password })
  //     .then((response) => {
  //       // If login is successful
  //       // setMessage('Login successful'); 
  //       toast.success('Login completed successfully!');
  //     })
  //     .catch((error) => {
  //       // Handle login errors
  //       toast.error("Failed to submit form. Please try again later.");
  //       setMessage('Invalid email or password');
  //     });
  // };
  const handleNextClick = (event) => {
    event.preventDefault();

    // Make an API call to the login endpoint to check email and password
    axios.post("http://localhost:4000/api/login", { email, password })
      .then((response) => {
        // If login is successful, show the OTP section
        toast.success('Login details verified. Please enter OTP.');
        setIsOtpVisible(true);
      })
      .catch((error) => {
        toast.error("Invalid email or password. Please try again.");
        setMessage('Invalid email or password');
      });
  };
  const handleLoginOtpSubmit = (event) => {
    event.preventDefault();

    // Verify the OTP here
    axios.post("http://localhost:4000/api/login-otp", { otp })
      .then((response) => {
        toast.success('Login completed successfully!');
      })
      .catch((error) => {
        toast.error("Failed to verify OTP. Please try again.");
        setMessage('Invalid OTP');
      });
  };

  return (
    <div className='RegMain' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem' }}>
        <div className='logContainer' id='logContainer' ref={containerRef} style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', height: '1000px' }}>
          <Card className="logContainer" style={{ width: '100%', padding: '2rem', marginLeft: '0', marginTop: '10rem' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar className="register-avatar" style={{ marginBottom: '1rem', marginLeft: "35rem" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" className="register-title" style={{ marginBottom: '1rem', marginLeft: "35rem" }}>
                Register
              </Typography>
              {message && <Alert severity="error" style={{ width: '100%', marginBottom: '1rem' }}>{message}</Alert>}
              <form style={{ width: '100%', maxWidth: '600px', marginTop: '1rem', marginLeft: "35rem" }}>
                <Stepper activeStep={activeStep} style={{ marginBottom: '1rem' }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel sx={{ color: 'green' }}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {getStepContent(activeStep)}

                <Box display="flex" justifyContent="space-between" style={{ marginTop: '1rem' }}>
                  {activeStep !== 0 && activeStep !== 3 && (
                    <button onClick={handleBack} className="register-button" type="button">
                      Back
                    </button>
                  )}
                  {activeStep === 3 ? (
                    <button
                      onClick={() => {
                        // Reset form data and active step
                        setFormData({
                          username: "",
                          email: "",
                          password: "",
                          Confirm_Password: '',
                          otp: "",
                          mobileNo: "",
                        });
                        setActiveStep(0); // Reset to step 0
                        loginBtnClick(); // Additional login logic
                      }}
                      className="register-button"
                      type="button"
                    >
                      Login
                    </button>
                  ) : (
                    <button onClick={handleNext} className="register-button" type="button">
                      Next
                    </button>
                  )}
                </Box>

                <Grid container justifyContent="center" style={{ marginTop: '1rem' }}>
                  <Grid item>
                    <Link to="/login" className="link-text">
                      Already have an account?
                    </Link>
                    <span className='' id='login' onClick={loginBtnClick}> Login</span>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Card>
          {/* <div className='form-logContainer sign-in' style={{ marginTop: '2rem' }}>
            <form onSubmit={handleLoginSubmit} style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
              <h1>Login</h1>
              <input
                type="text"
                value={email}
                placeholder='Email'
                onChange={handleEmailChange}
                required
                style={{ width: '100%', marginBottom: '1rem' }}
              />
              <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={handlePasswordChange}
                required
                style={{ width: '100%', marginBottom: '1rem' }}
              />
              <a href="#" style={{ marginBottom: '1rem' }}>Forget Your Password?</a>
              {message && <p>{message}</p>}
              <button onClick={handleLoginSubmit} style={{ width: '100%' }}>Login</button>
            </form>
          </div> */}
      <Box className='form-logContainer sign-in' sx={{ marginTop: '2rem' }}>
      {/* Render Email and Password Section only if OTP is not visible */}
      {!isOtpVisible && (
        <form onSubmit={handleNextClick} style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>

          <TextField
            type="text"
            value={email}
            onChange={handleEmailChange}
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            type="password"
            value={password}
            onChange={handlePasswordChange}
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />

          {/* Forgot Password Link */}
          <Box sx={{ marginBottom: '1rem' }}>
            <Typography variant="body2" component="a" href="#" color="primary">
              Forgot Your Password?
            </Typography>
          </Box>

          {/* Display Message */}
          {message && <Typography color="error">{message}</Typography>}

          {/* Next Button */}
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </form>
      )}

      {/* Render OTP Section only if OTP is visible */}
      {isOtpVisible && (
        <form onSubmit={handleLoginOtpSubmit} style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Enter OTP
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            {otp.map((value, index) => (
              <TextField
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={value}
                onChange={(e) => handleOtpChange(e, index)}
                inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                sx={{
                  width: '60px',
                  height: '60px',
                  fontSize: '24px',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
                variant="outlined"
              />
            ))}
          </Box>

          {/* Submit OTP Button */}
          <Button type="submit" variant="contained" fullWidth sx={{ marginTop: '2rem' }}>
            Verify OTP
          </Button>
        </form>
      )}
    </Box>
          <div className='toggle-logContainer'>
            <div className='toggle'>
              <div className='toggle-panel toggle-left'>
                <h1>Welcome Back!</h1>
                <p>Enter your personal details to use all of the site's features</p>
                <button className='hidden' id='login' onClick={loginBtnClick}>Login</button>
              </div>
              <div className='toggle-panel toggle-right'>
                <h1>EmpairIndia</h1>
                <p>Register with your personal details to use all of the site's features</p>
                <button className='hidden' id='register' onClick={registerBtnClick}>Register</button>
              </div>
            </div>
          </div>
        </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: '15px',  // Increase font size here
          },
        }}
        expand={true}
        richColors
      />

    </div>
  )
}