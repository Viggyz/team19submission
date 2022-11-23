import React, { useEffect } from 'react';

import {
  Link,
  Modal, 
  Paper,
  Box, 
  TextField, 
  Button, 
  Typography,
} from "@mui/material";


import {Auth} from "../api.service";
import {email_regex, username_regex} from "../regex";

function AuthModal({openAuthModal, handleAuthClose, setsnackbarState}) {
    const [loginDetails, setLoginDetails] = React.useState({
      username: "",
      password: "",
    });
    const [signUpDetails, setSignUpDetails] = React.useState({
        username: "",
        email: "",
        password: "",
    })
    const [isSignUp, setIsSignUp] = React.useState(false);
    const [errors, setErrors] = React.useState({
      username: null,
      email: null,
      password: null,
    });
    
    function validateSignup() {
      let errors = {};
     if(!username_regex.test(signUpDetails.username)) {
        errors.username = "Invalid characters in username";
      }
      else if (!email_regex.test(signUpDetails.email)) {
        errors.email = "Invalid email";
      }
      if (!signUpDetails.password.length) {
        errors.password = "Password cannot be empty";
      }
      else if (signUpDetails.password.length < 4) {
        errors.password = "Password cannot be less than 4 chars";
      }
      if (Object.keys(errors).length) {
        setErrors(errors)
        return false;
      }
      setErrors({
        username: null,
        email: null,
        password: null,
      })
      return true;
    }

    const handleSignUp = () => {
        if(!validateSignup()) return;
        Auth.signUp(signUpDetails)
        .then(()=>{
          setSignUpDetails({
            username: "",
            email: "",
            password: "",
          })
          setsnackbarState({open: true, message: "Succesfully signed up!", severity: "success"});
          handleAuthClose();
        })
        .catch((err) => {
          if(err.response.status===500) {
            setsnackbarState({open: true, message: "Username already exists", severity: "error"})
          }
          else {
            setsnackbarState({open: true, message: "Unable to sign up", severity: "error"})
          }
        })
      };
    
    const handleLogin = () => {
        Auth.login(loginDetails)
        .then(() => {
          setsnackbarState({open: true, message: "Succesfully logged in!", severity: "success"});
          handleAuthClose();
        })
        .catch((err)=> {
          console.log(err);
          setsnackbarState({open: true, message: "Unable to log in", severity: "error"});
        });
    };

    useEffect(() => {
      setSignUpDetails({
        username: "",
        email: "",
        password: "",
      });
      setLoginDetails({
        username: "",
        password: "",
      })
      setErrors({
        username: null,
        email: null,
        password: null,
      })

    },[openAuthModal])
    
    return (
        <Modal
        open={openAuthModal}
        onClose={handleAuthClose}
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
              <TextField 
                value={signUpDetails.email} 
                variant = 'outlined' 
                label = 'Email' 
                sx={{
                  my: '7px', 
                  width: '75%'
                }} 
                onChange={(evt) => {
                    return setSignUpDetails({...signUpDetails, email: evt.target.value})
                }}
                error={!email_regex.test(signUpDetails.email) && errors.email}
                helperText={
                  !email_regex.test(signUpDetails.email) && errors.email ?
                    !signUpDetails.email?
                      errors.email:
                      "Invalid email"
                    :
                    ""
                }
              />

              <TextField 
                value={signUpDetails.username} 
                variant = 'outlined' 
                label = 'Username' 
                sx={{
                  my: '7px', 
                  width: '75%'
                }} 
                onChange={(evt) => {
                  return setSignUpDetails({...signUpDetails, username: evt.target.value})
                }}
                error={!username_regex.test(signUpDetails.username) && errors.username}
                helperText={
                  !username_regex.test(signUpDetails.username) && errors.username ?
                  signUpDetails.username.length < 4?
                      "Username cannot be less than 4 characters":
                      errors.username 
                    :
                    ""
                }
               />
              <TextField 
                value={signUpDetails.password} 
                variant = 'outlined' 
                label = 'Password' 
                type='password' 
                sx={{
                  my: '7px',
                  mb: '10px', 
                  width: '75%'
                }} 
                onChange={(evt) => {
                  return setSignUpDetails({...signUpDetails, password: evt.target.value})
                }}
                error={signUpDetails.password.length < 4 && errors.password}
                helperText={
                  signUpDetails.password.length < 4 ?
                      errors.password:
                      ""
                }
              />
              <Button variant='outlined' sx={{my: '10px'}} onClick={handleSignUp}>SIGN UP</Button>
              <Typography variant = 'subtitle2' sx={{color: 'text.secondary'}}>Already Signed In? <Link href="#" underline='hover' onClick={() => {
                    return setIsSignUp(false);
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
                    return setIsSignUp(true);
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