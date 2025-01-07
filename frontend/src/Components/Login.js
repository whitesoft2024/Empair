import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Container, Card, Alert, Button, TextField, Box, Typography, Grid, Avatar  } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import { UserContext } from "./UserContext";
import './Style/Logina.css';

const Login = () => {
  // const { login } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: "/menu" } }; // Capture previous location

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:2024/api/auth/login",
        formData
      );
      setMessage(response.data.message, "Login successful");
      console.log(response.data); // Log the response data
      // login(response.data.user);
      // Store token in local storage or context
      localStorage.setItem("token", response.data.token);
      // Navigate to the home page
      navigate(from.pathname);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Login failed. Please try again.");
      }
    }
  };
  // Inline styles for the login container with background image
 
  return (
   <Container component="main" className="login-container">
      <Box className="login-left">
        <Typography component="h1" variant="h3" className="welcome-text">
          Welcome Back!
        </Typography>
        <Typography component="p" className="info-text">
          Sign in to continue to our application.
        </Typography>
      </Box>
      <Card className="login-right">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar className="login-avatar">
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="login-title">
            Login
          </Typography>
          {message && (
            <Alert severity="error" style={{ width: '100%', marginTop: '1rem' }}>
              {message}
            </Alert>
          )}
          <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="login-button"
            >
              Login
            </Button>
            <Grid container justifyContent="space-between" style={{ marginTop: "1rem" }}>
              <Grid item>
                <Link to="/register" className="link-text">
                  Don't have an account? Register
                </Link>
              </Grid>
              <Grid item>
                <Link to="/adminlogin" className="link-text">
                  Login as Admin?
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Card>
    </Container>
  );
};

export default Login;
