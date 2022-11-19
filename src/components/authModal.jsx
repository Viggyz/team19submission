import React from 'react';

import {Modal, Paper,Box, TextField, Button} from "@mui/material";

function AuthModal({openAuthModal, handleClose}) {
    const {signUpDetails, setSignUpDetails} = React.useState({
        username: "",
        email: "",
        password: "",
    })
    const {isSignUp, setIsSignUp} = React.useState(false);

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
              <div className="sigup-label">SIGN UP</div>
              <div className="sigup-email">Email</div>
              <TextField onChange={(evt) => {
                  return setSignUpDetails({...signUpDetaills, email: evt.target.value})
                }} />
              <div> </div>
              <div className="sigup-username">Username</div>
              <TextField onChange={(evt) => {
                  return setSignUpDetails({...signUpDetails, username: evt.target.value})
                }} />
              <div> </div>
              <div className="sigup-password">Password</div>
              <TextField onChange={(evt) => {
                return setSignUpDetails({...signUpDetails, password: evt.target.value})
            }} />
              <div></div>
              <Button onClick={handleSignUp}>SIGN UP</Button>
              <div>Already Signed In?</div>
              <Button
                onClick={() => {
                    return setIsSignUp(false);
                }}
              >
                Login
              </Button>
            </div>
          )
          :
          (
              <div className="signup-Modal">
          <div className="sigup-label">LOGIN</div>
          <div className="sigup-email">Username</div>
          <TextField onChange={(evt) => setLoginUsername(evt.target.value)} />
          <div> </div>
          <div className="sigup-username">Password</div>
          <TextField onChange={(evt) => setLoginPassword(evt.target.value)} />
          <div> </div>
          <Button onClick={handleLogin}>Login</Button>
          <div>Don't have an account?</div> 
          <Button onClick={()=>{return setIsSignUp(true)}}>Sign Up</Button>          
        </div>)
        }
        </Paper>
        </Box>
        </Modal>
    )
}

export default AuthModal;