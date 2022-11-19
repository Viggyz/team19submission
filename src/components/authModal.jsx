import React from 'react';
import axios from 'axios';

import {Link, Modal, Paper,Box, TextField, Button, Typography} from "@mui/material";

function AuthModal({openAuthModal, handleClose}) {
    const [loginDetails, setLoginDetails] = React.useState({
      username: "",
      password: "",
    });
    const [signUpDetails, setSignUpDetails] = React.useState({
        username: "",
        email: "",
        password: "",
    })
    const [isSignUp, setIsSignUp] = React.useState(0);

    const handleSignUp = () => {
        axios.post("http://localhost:8000/api/auth/signup",signUpDetails)
        .then((response)=>{console.log(response)});
      };
    
    const handleLogin = () => {
        console.log(loginUsername, loginPassword);
        axios.post("http://localhost:8000/api/auth/login",
        {
            "username": loginUsername,
            "password": loginPassword,
        }
        )
        .then(({data})=>{window.localStorage.setItem("access", data.access);window.localStorage.setItem("refresh", data.refresh);});
    };
    
    return (
        <Modal
        open={openAuthModal}
        onClose={handleClose}
        >
        <Box>
            <Paper 
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    // bgcolor: 'background.paper',
                    // border: '2px solid #000',
                    boxShadow: 24,
                    padding: '1rem',
                }}
            >
        { isSignUp ? (
            <div className="signup-Modal">
              <Typography variant='h5' className="signup-label">SIGN UP </Typography>
              <TextField value={signUpDetails.email} variant = 'outlined' label = 'Email' sx={{
                my: '7px', 
                width: '75%'
              }} 
              onChange={(evt) => {
                  return setSignUpDetails({...signUpDetails, email: evt.target.value})
                }} />

              <TextField value={signUpDetails.username} variant = 'outlined' label = 'Username' sx={{
                my: '7px', 
                width: '75%'
              }} 
              onChange={(evt) => {
                  return setSignUpDetails({...signUpDetails, username: evt.target.value})
                }} />
              <TextField value={signUpDetails.password} variant = 'outlined' label = 'Password' type='password' sx={{
                my: '7px',
                mb: '10px', 
                width: '75%'
              }} 
              onChange={(evt) => {
                return setSignUpDetails({...signUpDetails, password: evt.target.value})
            }} />
              <Button variant='outlined' sx={{my: '10px'}} onClick={handleSignUp}>SIGN UP</Button>
              <Typography variant = 'subtitle2' sx={{color: 'text.secondary'}}>Already Signed In? <Link href="#" underline='hover' onClick={() => {
                    return setIsSignUp(0);
                }}>
                  Login</Link></Typography>
            </div>
          )
          :
          (
            <div className="signup-Modal">
              <Typography variant='h5' className="signup-label"> LOGIN </Typography>
              <TextField value={loginDetails.username} variant = 'outlined' label = 'Username' sx={{
                mt: '10px',
                my: '7px', 
                width: '75%'
              }} 
              onChange={(evt) => setLoginDetails({...loginDetails, username: evt.target.value})} />
              <TextField value={loginDetails.password} variant = 'outlined' label = 'Password' type='password' sx={{
                my: '7px',
                mb: '10px', 
                width: '75%'
              }} 
              onChange={(evt) => setLoginDetails({...loginDetails, password: evt.target.value})} />
              <div> </div>
              <Button variant='outlined' sx={{my: '10px'}} onClick={handleLogin}>Login</Button>
              <Typography variant = 'subtitle2' sx={{color: 'text.secondary'}}>Don't have an account? <Link href="#" underline='hover' onClick={() => {
                    return setIsSignUp(1);
                }}>
                  Sign Up</Link></Typography>          
        </div>)
        }
        </Paper>
        </Box>
        </Modal>
    )
}

export default AuthModal;